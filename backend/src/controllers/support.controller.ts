import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Create Ticket
export const createTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { category, subject, message, assetRef } = req.body;
        const userId = req.user!.id;

        const ticket = await prisma.supportTicket.create({
            data: {
                userId,
                category,
                subject,
                message, // Initial message
                assetRef,
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

        res.status(201).json({
            success: true,
            data: ticket,
            message: 'Support ticket created successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get User Tickets
export const getUserTickets = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const tickets = await prisma.supportTicket.findMany({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        next(error);
    }
};

// Reply to Ticket
export const replyToTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const ticketId = req.params.id;
        const { message } = req.body;

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId }
        });

        if (!ticket) return next(new AppError('Ticket not found', 404));
        if (ticket.userId !== userId) return next(new AppError('Unauthorized', 403));

        if (ticket.status === 'closed') return next(new AppError('Ticket is closed', 400));

        const newMessage = await prisma.ticketMessage.create({
            data: {
                ticketId,
                sender: 'user',
                message
            }
        });

        // Update ticket updated_at
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date(), status: 'open' } // Re-open if was pending
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        next(error);
    }
};
