import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Intent Detection Logic
const detectIntent = (text: string): { category: string; priority: string; action: string } => {
    const lower = text.toLowerCase();

    // Priorities
    let priority = 'Low';
    if (lower.match(/fraud|locked|unauthorized|missing funds|steal|hacked/)) priority = 'High';
    else if (lower.match(/delay|pending|fail|issue|problem|error/)) priority = 'Medium';

    // Categories & Actions
    if (lower.match(/payment|withdraw|deposit|fund|transaction|money/)) {
        return { category: 'Financial', priority, action: 'create_ticket' };
    }
    if (lower.match(/kyc|verify|id|document|upload|bvn/)) {
        return { category: 'Verification', priority, action: 'create_ticket' };
    }
    if (lower.match(/bug|crash|load|login|password|reset/)) {
        return { category: 'Technical', priority, action: 'create_ticket' };
    }
    if (lower.match(/human|admin|agent|support|person/)) {
        return { category: 'Other', priority: 'High', action: 'handover' };
    }

    return { category: 'General', priority: 'Low', action: 'guidance' };
};

export const handleChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { message, context } = req.body;

        if (!message) return next(new AppError('Message is required', 400));

        // Detect Intent
        const intent = detectIntent(message);

        // Logic based on Intent
        let response = "";
        let ticketAction = null;

        if (intent.action === 'guidance') {
            // Static Guidance Logic (Enhanced)
            if (message.toLowerCase().includes('hello')) response = "Hello! I am Hermeos Guide. How can I assist you?";
            else if (message.toLowerCase().includes('status')) {
                // Check actual status based on keywords
                if (message.toLowerCase().includes('kyc')) {
                    const user = await prisma.user.findUnique({ where: { id: userId } });
                    response = `Your KYC status is: ${user?.kycStatus || 'Unknown'}.`;
                } else {
                    response = "I can check your KYC or Transaction status. What specifically would you like to know?";
                }
            } else {
                response = "I can help with guidance. If you have a specific issue, please describe it (e.g., 'Payment issue', 'KYC failed').";
            }
        } else {
            // Ticket Creation / Appending logic
            const category = intent.category;

            // Check for existing OPEN ticket for this user & category
            const existingTicket = await prisma.supportTicket.findFirst({
                where: {
                    userId,
                    category,
                    status: { not: 'closed' } // assuming closed status
                },
                orderBy: { updatedAt: 'desc' }
            });

            if (existingTicket) {
                // Append message
                await prisma.ticketMessage.create({
                    data: {
                        ticketId: existingTicket.id,
                        sender: 'user',
                        message
                    }
                });

                // Update ticket timestamp
                await prisma.supportTicket.update({
                    where: { id: existingTicket.id },
                    data: { updatedAt: new Date() } // Bump to top
                });

                response = `I've added this to your open ${category} ticket (#${existingTicket.id.slice(0, 8)}). An admin will review it shortly.`;
                ticketAction = "updated";
            } else {
                // Create New Ticket
                const newTicket = await prisma.supportTicket.create({
                    data: {
                        userId,
                        subject: `${category} Issue: ${message.substring(0, 30)}...`,
                        message: message, // Initial message in ticket body or separate? Schema has message field.
                        category,
                        priority: intent.priority,
                        status: 'open',
                        messages: {
                            create: {
                                sender: 'user',
                                message
                            }
                        }
                    }
                });
                response = `I've created a new ${intent.priority}-priority ${category} ticket (#${newTicket.id.slice(0, 8)}) for you. Our team has been notified.`;
                ticketAction = "created";
            }
        }

        res.status(200).json({
            success: true,
            data: {
                reply: response,
                intent,
                ticketAction
            }
        });

    } catch (error) {
        next(error);
    }
};

export const getBroadcasts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Fetch recent broadcasts (Notifications)
        const broadcasts = await prisma.notification.findMany({
            where: {
                type: 'BROADCAST',
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24h
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: broadcasts });
    } catch (error) {
        next(error);
    }
};
