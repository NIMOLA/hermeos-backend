import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get Notifications
export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20; // Default limit
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where: { userId: req.user!.id },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: skip
            }),
            prisma.notification.count({ where: { userId: req.user!.id } })
        ]);

        const unreadCount = await prisma.notification.count({
            where: { userId: req.user!.id, isRead: false }
        });

        res.status(200).json({
            success: true,
            data: notifications,
            meta: {
                total,
                page,
                limit,
                unreadCount
            }
        });
    } catch (error) {
        next(error);
    }
};

// Mark as Read
export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.notification.updateMany({
            where: {
                id: id === 'all' ? undefined : id, // Handle 'all' logic if passed as ID param in separate route or use query? Usually route /read-all vs /:id/read
                userId: req.user!.id
            },
            data: { isRead: true, read: true }
        });

        res.status(200).json({ success: true, message: 'Updated' });
    } catch (error) {
        next(error);
    }
};

// Mark All Read logic separate if needed
export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user!.id, isRead: false },
            data: { isRead: true, read: true }
        });
        res.status(200).json({ success: true, message: 'All marked as read' });
    } catch (error) {
        next(error);
    }
};

// Delete Notification
export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.notification.deleteMany({
            where: { id, userId: req.user!.id }
        });
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        next(error);
    }
};
