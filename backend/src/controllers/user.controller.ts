import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get user dashboard overview
export const getOverview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        // Fetch user data including ownerships and transactions in parallel
        const [user, ownerships, recentTransactions, notificationCount] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    walletBalance: true,
                    isVerified: true,
                    kycStatus: true,
                    tier: true
                }
            }),
            prisma.ownership.findMany({
                where: { userId },
                include: {
                    property: {
                        select: {
                            id: true,
                            name: true,
                            location: true,
                            totalValue: true,
                            totalUnits: true,
                            status: true
                        }
                    }
                }
            }),
            prisma.transaction.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5
            }),
            prisma.notification.count({
                where: { userId, isRead: false }
            })
        ]);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Calculate portfolio value (sum of acquisition prices for now, or live value if we have property updates)
        const totalPortfolioValue = ownerships.reduce((sum: number, o: any) => sum + Number(o.acquisitionPrice), 0);

        // Calculate earnings (sum of distribution transactions)
        const totalEarnings = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'DISTRIBUTION',
                status: 'COMPLETED'
            },
            _sum: { amount: true }
        });

        res.status(200).json({
            success: true,
            data: {
                walletBalance: user.walletBalance,
                portfolioValue: totalPortfolioValue,
                totalEarnings: totalEarnings._sum.amount || 0,
                activeAssets: ownerships.length,
                kycStatus: user.kycStatus,
                isVerified: user.isVerified,
                tier: user.tier,
                recentActivity: recentTransactions,
                unreadNotifications: notificationCount,
                portfolioBreakdown: ownerships.map(o => ({
                    propertyName: o.property.name,
                    units: o.units,
                    value: o.acquisitionPrice
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get user notifications
export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user!.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

// Mark notification as read
export const markNotificationRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.notification.update({
            where: { id, userId: req.user!.id },
            data: { isRead: true }
        });

        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        next(error);
    }
};

// Get user documents
export const getDocuments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const documents = await prisma.document.findMany({
            where: { userId: req.user!.id },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        next(error);
    }
};
