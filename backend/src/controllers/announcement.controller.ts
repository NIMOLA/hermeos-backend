import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// Placeholder for in-memory storage until DB migration is run
const mockAnnouncements: any[] = [];

/**
 * Send an announcement
 * POST /api/admin/announcements
 */
export const sendAnnouncement = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { recipient, subject, message } = req.body;
        const senderId = req.user?.id;

        if (!subject || !message) {
            return next(new AppError('Subject and message are required', 400));
        }

        // TODO: Switch to Prisma after migration
        /*
        const announcement = await prisma.announcement.create({
            data: {
                recipient,
                subject,
                message,
                sentBy: senderId!
            }
        });
        */

        const announcement = {
            id: crypto.randomUUID(),
            recipient,
            subject,
            message,
            sentBy: senderId,
            createdAt: new Date().toISOString()
        };

        mockAnnouncements.unshift(announcement);

        // TODO: Trigger email service here
        // await emailService.broadcast(recipient, subject, message);

        res.status(201).json({
            success: true,
            data: announcement,
            message: `Announcement sent to ${recipient === 'all' ? 'all users' : recipient}`
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get announcement history
 * GET /api/admin/announcements
 */
export const getAnnouncements = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // TODO: Switch to Prisma after migration
        // const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });

        res.status(200).json({
            success: true,
            data: mockAnnouncements
        });
    } catch (error) {
        next(error);
    }
};
