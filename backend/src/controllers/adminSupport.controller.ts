import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

/**
 * Get all support tickets (Admin)
 */
export const getAllTickets = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tickets = await prisma.supportTicket.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: tickets
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Resolve/Reply to ticket
 * For now, this just updates status. Full email reply logic can be added later.
 */
export const resolveTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status, resolutionNote } = req.body;

        const ticket = await prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket) {
            return next(new AppError('Ticket not found', 404));
        }

        const updatedTicket = await prisma.supportTicket.update({
            where: { id },
            data: {
                status: status || 'resolved',
                // Assuming we might add resolutionNote field later, or log it
            }
        });

        // Notify User
        await prisma.notification.create({
            data: {
                userId: ticket.userId,
                title: 'Support Ticket Update',
                message: `Your ticket "${ticket.subject}" has been marked as ${status || 'resolved'}.`,
                type: 'info'
            }
        });

        res.json({
            success: true,
            data: updatedTicket,
            message: 'Ticket updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
