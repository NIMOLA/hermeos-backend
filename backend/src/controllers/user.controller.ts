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

// NEW: Get dashboard stats (for frontend Phase 2)
export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        // Get all user's ownerships
        const ownerships = await prisma.ownership.findMany({
            where: { userId },
            select: {
                acquisitionPrice: true,
                currentValue: true
            }
        });

        const portfolioValue = ownerships.reduce((sum, o) => sum + Number(o.currentValue || o.acquisitionPrice), 0);
        const acquisitionValue = ownerships.reduce((sum, o) => sum + Number(o.acquisitionPrice), 0);
        const portfolioGrowth = acquisitionValue > 0
            ? Number((((portfolioValue - acquisitionValue) / acquisitionValue) * 100).toFixed(1))
            : 0;

        // Get total earnings from distributions
        const earnings = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'DISTRIBUTION',
                status: 'COMPLETED'
            },
            _sum: { amount: true }
        });

        res.json({
            portfolioValue,
            portfolioGrowth,
            totalEarnings: Number(earnings._sum.amount || 0),
            activeAssets: ownerships.length
        });
    } catch (error) {
        next(error);
    }
};

// NEW: Get user activity (for frontend Phase 2)
export const getActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const limit = Math.min(Number(req.query.limit) || 10, 50);

        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                property: {
                    select: {
                        name: true
                    }
                }
            }
        });

        const activity = transactions.map(t => ({
            id: t.id,
            type: t.type.toLowerCase(),
            title: getActivityTitle(t.type),
            description: t.property ? `${t.property.name} • ${t.description || 'Transaction'}` : t.description || 'Transaction',
            amount: Number(t.amount),
            createdAt: t.createdAt
        }));

        res.json(activity);
    } catch (error) {
        next(error);
    }
};

// NEW: Get portfolio summary (for frontend Phase 2)
export const getPortfolioSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const ownerships = await prisma.ownership.findMany({
            where: { userId },
            include: {
                property: {
                    select: {
                        name: true,
                        location: true,
                        propertyType: true
                    }
                }
            }
        });

        const totalValue = ownerships.reduce((sum, o) => sum + Number(o.currentValue || o.acquisitionPrice), 0);
        const acquisitionValue = ownerships.reduce((sum, o) => sum + Number(o.acquisitionPrice), 0);
        const appreciation = acquisitionValue > 0
            ? Number((((totalValue - acquisitionValue) / acquisitionValue) * 100).toFixed(1))
            : 0;

        // Get YTD yield
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const dividends = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'DISTRIBUTION',
                status: 'COMPLETED',
                createdAt: { gte: startOfYear }
            },
            _sum: { amount: true }
        });

        const netYield = Number(dividends._sum.amount || 0);
        const averageYield = acquisitionValue > 0 ? Number(((netYield / acquisitionValue) * 100).toFixed(1)) : 0;

        // Calculate allocation by property type
        const residential = ownerships.filter(o => o.property.propertyType === 'RESIDENTIAL');
        const commercial = ownerships.filter(o => o.property.propertyType === 'COMMERCIAL');
        const industrial = ownerships.filter(o => o.property.propertyType === 'INDUSTRIAL');

        const residentialValue = residential.reduce((sum, o) => sum + Number(o.currentValue || o.acquisitionPrice), 0);
        const commercialValue = commercial.reduce((sum, o) => sum + Number(o.currentValue || o.acquisitionPrice), 0);
        const industrialValue = industrial.reduce((sum, o) => sum + Number(o.currentValue || o.acquisitionPrice), 0);

        const locations = new Set(ownerships.map(o => o.property.location)).size;

        res.json({
            totalValue,
            acquisitionValue,
            appreciation,
            netYield,
            averageYield,
            propertiesCount: ownerships.length,
            locations,
            allocation: {
                residential: totalValue > 0 ? Math.round((residentialValue / totalValue) * 100) : 0,
                commercial: totalValue > 0 ? Math.round((commercialValue / totalValue) * 100) : 0,
                industrial: totalValue > 0 ? Math.round((industrialValue / totalValue) * 100) : 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// NEW: Get portfolio holdings (for frontend Phase 2)
export const getPortfolioHoldings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const ownerships = await prisma.ownership.findMany({
            where: { userId },
            include: {
                property: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        images: true
                    }
                }
            }
        });

        // Get total yield for each holding
        const holdingsWithYield = await Promise.all(
            ownerships.map(async (o) => {
                const totalYield = await prisma.transaction.aggregate({
                    where: {
                        userId,
                        propertyId: o.propertyId,
                        type: 'DISTRIBUTION',
                        status: 'COMPLETED'
                    },
                    _sum: { amount: true }
                });

                const ownershipPercent = o.property ? (o.units / 100) : 0; // Mock calculation

                return {
                    id: o.id,
                    name: o.property.name,
                    location: o.property.location,
                    imageUrl: o.property.images?.[0] || '',
                    status: o.status.toLowerCase(),
                    ownershipPercent: Number(ownershipPercent.toFixed(2)),
                    currentValue: Number(o.currentValue || o.acquisitionPrice),
                    totalYield: Number(totalYield._sum.amount || 0),
                    acquisitionDate: o.acquisitionDate // For Lock-up logic
                };
            })
        );

        res.json(holdingsWithYield);
    } catch (error) {
        next(error);
    }
};

// Toggle saved property (Bookmark)
export const toggleSavedProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { propertyId } = req.body;

        if (!propertyId) {
            return next(new AppError('Property ID is required', 400));
        }

        const existing = await prisma.savedProperty.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        if (existing) {
            await prisma.savedProperty.delete({
                where: { id: existing.id }
            });
            res.status(200).json({
                success: true,
                message: 'Property removed from saved list',
                data: { isSaved: false }
            });
        } else {
            await prisma.savedProperty.create({
                data: {
                    userId,
                    propertyId
                }
            });
            res.status(200).json({
                success: true,
                message: 'Property saved',
                data: { isSaved: true }
            });
        }
    } catch (error) {
        next(error);
    }
};

// Get saved properties
export const getSavedProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const saved = await prisma.savedProperty.findMany({
            where: { userId },
            include: {
                property: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        totalValue: true,
                        expectedAnnualIncome: true,
                        images: true,
                        status: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formatted = saved.map(s => ({
            ...s.property,
            savedAt: s.createdAt,
            imageUrl: s.property.images?.[0] || ''
        }));

        res.status(200).json({
            success: true,
            data: formatted
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to get activity title
function getActivityTitle(type: string): string {
    const titles: Record<string, string> = {
        DISTRIBUTION: 'Rental Dividend Received',
        PURCHASE: 'Property Purchase',
        DEPOSIT: 'Wallet Deposit',
        WITHDRAWAL: 'Wallet Withdrawal'
    };
    return titles[type] || 'Transaction';
}
