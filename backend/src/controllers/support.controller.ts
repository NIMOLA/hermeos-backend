import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// --- CONFIGURATION ---
const SPAM_LIMIT_COUNT = 3;
const SPAM_Limit_WINDOW_MS = 60 * 60 * 1000; // 1 Hour
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000; // 5 Minutes

// --- HELPERS ---

/**
 * Detects priority based on keywords and user tier
 */
const determinePriority = (userTier: string, subject: string, message: string): string => {
    // 1. VIP Override
    if (userTier === 'Tier 3' || userTier === 'Institutional' || userTier === 'Gold') {
        return 'high';
    }

    // 2. Keyword Analysis
    const content = (subject + ' ' + message).toLowerCase();

    if (content.match(/fraud|stolen|hacked|unauthorized|emergency/)) return 'high';
    if (content.match(/urgent|fail|error|crash/)) return 'high'; // Maybe medium? Let's be generous.
    if (content.match(/verification|kyc|document/)) return 'medium';

    return 'medium'; // Default standard
};

/**
 * Smart Category Routing
 */
const smartRouteCategory = (selectedCategory: string, message: string): string => {
    const lower = message.toLowerCase();

    if (selectedCategory === 'Other') {
        if (lower.includes('money') || lower.includes('withdraw')) return 'Wallet Funding / Withdrawal';
        if (lower.includes('deed') || lower.includes('contract')) return 'Property Ownership / Deeds';
        if (lower.includes('login') || lower.includes('password')) return 'Technical Issue';
    }
    return selectedCategory;
};

// --- CONTROLLERS ---

export const createTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { category, subject, message, assetRef } = req.body;
        const userId = req.user!.id;

        if (!subject || !message) return next(new AppError('Subject and message are required', 400));

        // 1. Fetch User for context (Tier checking)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return next(new AppError('User not found', 404));

        // 2. RATE LIMITING (Spam Protection)
        const recentTickets = await prisma.supportTicket.count({
            where: {
                userId,
                createdAt: { gte: new Date(Date.now() - SPAM_Limit_WINDOW_MS) }
            }
        });

        if (recentTickets >= SPAM_LIMIT_COUNT) {
            return next(new AppError('You have exceeded the ticket limit for this hour. Please wait before submitting another.', 429));
        }

        // 3. DUPLICATE DETECTION
        const duplicate = await prisma.supportTicket.findFirst({
            where: {
                userId,
                subject,
                createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) }
            }
        });

        if (duplicate) {
            return next(new AppError('You recently submitted a ticket with this subject. Please verify your open tickets.', 409));
        }

        // 4. INTELLIGENT PROCESSING
        const finalPriority = determinePriority(user.tier, subject, message);
        const finalCategory = smartRouteCategory(category || 'Other', message);

        // 5. ATOMIC CREATION
        const ticket = await prisma.supportTicket.create({
            data: {
                userId,
                category: finalCategory,
                subject,
                message, // Initial body
                assetRef,
                priority: finalPriority,
                status: 'open',
                messages: {
                    create: {
                        sender: 'user',
                        message
                    }
                }
            },
            include: { messages: true }
        });

        // 6. SLA CALCULATION (Virtual/Response enriched)
        // We assume logic elsewhere handles the actual checking, but we can tag response.
        const slaHours = finalPriority === 'high' ? 24 : 48;
        const slaTarget = new Date(ticket.createdAt.getTime() + slaHours * 60 * 60 * 1000);

        res.status(201).json({
            success: true,
            data: {
                ...ticket,
                slaTarget,
                vipStatus: finalPriority === 'high' ? 'Active' : undefined
            },
            message: 'Support ticket tracked and assigned.'
        });

    } catch (error) {
        next(error);
    }
};

export const getUserTickets = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const tickets = await prisma.supportTicket.findMany({
            where: { userId },
            include: {
                messages: { orderBy: { createdAt: 'asc' } }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        next(error);
    }
};

export const replyToTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const ticketId = req.params.id;
        const { message } = req.body;

        if (!message) return next(new AppError('Message is required', 400));

        const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });

        if (!ticket) return next(new AppError('Ticket not found', 404));
        if (ticket.userId !== userId) return next(new AppError('Unauthorized', 403));

        // EDGE CASE: Cannot reply to archived tickets
        if (ticket.status === 'archived' || ticket.status === 'locked') {
            return next(new AppError('This ticket is archived and cannot be replied to. Please open a new ticket.', 400));
        }

        const newMessage = await prisma.ticketMessage.create({
            data: {
                ticketId,
                sender: 'user',
                message
            }
        });

        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                updatedAt: new Date(),
                status: ticket.status === 'closed' ? 'open' : ticket.status
            }
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        next(error);
    }
};
