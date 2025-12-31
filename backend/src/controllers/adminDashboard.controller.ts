import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Total partners (users with USER/BASIC/PREMIUM/INSTITUTIONAL roles)
        const totalPartners = await prisma.user.count({
            where: {
                role: {
                    in: ['USER', 'FREE_USER', 'BASIC', 'PREMIUM', 'INSTITUTIONAL']
                }
            }
        });

        // Calculate previous month for comparison
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const partnersThisMonth = await prisma.user.count({
            where: {
                role: {
                    in: ['USER', 'FREE_USER', 'BASIC', 'PREMIUM', 'INSTITUTIONAL']
                },
                createdAt: {
                    gte: thisMonth
                }
            }
        });

        const partnersLastMonth = await prisma.user.count({
            where: {
                role: {
                    in: ['USER', 'FREE_USER', 'BASIC', 'PREMIUM', 'INSTITUTIONAL']
                },
                createdAt: {
                    gte: lastMonth,
                    lt: thisMonth
                }
            }
        });

        const partnerGrowth = partnersLastMonth > 0
            ? Math.round(((partnersThisMonth - partnersLastMonth) / partnersLastMonth) * 100)
            : 100;

        // Total assets under management (sum of all property values)
        const assetsData = await prisma.property.aggregate({
            _sum: {
                totalValue: true
            }
        });

        const totalAUM = Number(assetsData._sum.totalValue || 0);

        // Active distributions (transactions with type DISTRIBUTION and status COMPLETED this month)
        const activeDistributions = await prisma.transaction.count({
            where: {
                type: 'DISTRIBUTION',
                status: 'COMPLETED',
                createdAt: {
                    gte: thisMonth
                }
            }
        });

        // Pending KYC approvals
        const pendingKYC = await prisma.user.count({
            where: {
                kycStatus: {
                    in: ['pending', 'submitted']
                }
            }
        });

        res.json({
            success: true,
            data: {
                totalPartners: {
                    value: totalPartners,
                    growth: partnerGrowth,
                    label: `${partnerGrowth >= 0 ? '+' : ''}${partnerGrowth}% this month`
                },
                assetsUnderManagement: {
                    value: totalAUM,
                    formatted: `₦${(totalAUM / 1000000000).toFixed(1)}B`,
                    label: 'Total AUM'
                },
                activeDistributions: {
                    value: activeDistributions,
                    label: `${activeDistributions} payouts this month`
                },
                pendingKYC: {
                    value: pendingKYC,
                    label: 'Requires review'
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get recent system activity
 */
export const getRecentActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;

        // Get recent audit logs
        const activities = await prisma.auditLog.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        const formattedActivities = activities.map(activity => {
            const userName = activity.user
                ? `${activity.user.firstName} ${activity.user.lastName}`
                : 'System';

            // Calculate time ago
            const now = new Date();
            const activityTime = new Date(activity.createdAt);
            const diffMs = now.getTime() - activityTime.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            let timeAgo;
            if (diffMins < 60) {
                timeAgo = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
            } else if (diffHours < 24) {
                timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
            } else if (diffDays < 7) {
                timeAgo = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
            } else {
                timeAgo = activityTime.toLocaleDateString();
            }

            return {
                id: activity.id,
                user: userName,
                action: activity.action,
                target: activity.resource,
                time: timeAgo
            };
        });

        res.json({
            success: true,
            data: formattedActivities
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all users for admin management
 */
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const role = req.query.role as string;
        const kycStatus = req.query.kycStatus as string;
        const search = req.query.search as string;

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (role && role !== 'all') {
            where.role = role.toUpperCase();
        }

        if (kycStatus && kycStatus !== 'all') {
            where.kycStatus = kycStatus.toLowerCase();
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Get users
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    kycStatus: true,
                    isVerified: true,
                    createdAt: true
                }
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user counts by status
 */
export const getUserStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const [totalUsers, verifiedKYC, pendingReview] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    kycStatus: 'verified'
                }
            }),
            prisma.user.count({
                where: {
                    kycStatus: {
                        in: ['pending', 'submitted']
                    }
                }
            })
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                verifiedKYC,
                pendingReview
            }
        });
    } catch (error) {
        next(error);
    }
};
