import { Response, NextFunction } from 'express';
import { PrismaClient, KYCStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get dashboard statistics
export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const [
            totalUsers,
            totalProperties,
            totalTransactions,
            pendingKYC,
            totalAUM
        ] = await Promise.all([
            prisma.user.count(), // totalUsers
            prisma.property.count(), // totalProperties
            prisma.transaction.count({ where: { status: 'COMPLETED' } }), // totalTransactions
            prisma.kYC.count({ where: { status: 'PENDING' } }), // pendingKYC
            prisma.ownership.aggregate({
                _sum: { acquisitionPrice: true }
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProperties,
                totalTransactions,
                pendingKYC,
                assetsUnderManagement: totalAUM._sum.acquisitionPrice || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get all users
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 20, search, kycStatus } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};
        if (search) {
            where.OR = [
                { email: { contains: search as string, mode: 'insensitive' } },
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } }
            ];
        }
        if (kycStatus) {
            where.kycStatus = kycStatus;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: Number(limit),
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    tier: true,
                    isVerified: true,
                    kycStatus: true,
                    walletBalance: true,
                    createdAt: true,
                    lastLogin: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get user by ID (detailed)
export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                kyc: true,
                ownerships: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                name: true,
                                location: true
                            }
                        }
                    }
                },
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                transferRequests: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Verify user email
export const verifyUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.update({
            where: { id },
            data: { isVerified: true }
        });

        await prisma.adminAuditLog.create({
            data: {
                adminId: req.user!.id,
                action: 'VERIFIED_USER',
                entityType: 'USER',
                entityId: id
            }
        });

        res.status(200).json({
            success: true,
            data: user,
            message: 'User verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Update user role
export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { role }
        });

        await prisma.adminAuditLog.create({
            data: {
                adminId: req.user!.id,
                action: 'UPDATED_USER_ROLE',
                entityType: 'USER',
                entityId: id,
                details: { newRole: role }
            }
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Get pending KYC
export const getPendingKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const pendingKYC = await prisma.kYC.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.status(200).json({
            success: true,
            data: pendingKYC
        });
    } catch (error) {
        next(error);
    }
};

// Approve KYC
export const approveKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const kyc = await prisma.kYC.update({
            where: { id },
            data: {
                status: 'APPROVED',
                verifiedAt: new Date(),
                verifiedBy: req.user!.id
            }
        });

        await prisma.user.update({
            where: { id: kyc.userId },
            data: { kycStatus: 'APPROVED' }
        });

        // Grant Verified Capabilities
        const verifiedCaps = await prisma.capability.findMany({
            where: { defaultOnSignup: false }
        });

        if (verifiedCaps.length > 0) {
            const userCapsData = verifiedCaps.map(cap => ({
                userId: kyc.userId,
                capabilityId: cap.id
            }));

            // Use createMany with skipDuplicates to avoid errors if they already have some
            await prisma.userCapability.createMany({
                data: userCapsData,
                skipDuplicates: true
            });
        }

        await prisma.adminAuditLog.create({
            data: {
                adminId: req.user!.id,
                action: 'APPROVED_KYC',
                entityType: 'KYC',
                entityId: id,
                details: { capabilitiesGranted: verifiedCaps.map(c => c.name) }
            }
        });

        res.status(200).json({
            success: true,
            data: kyc,
            message: 'KYC approved successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Reject KYC
export const rejectKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        const kyc = await prisma.kYC.update({
            where: { id },
            data: {
                status: 'REJECTED',
                rejectionReason,
                verifiedAt: new Date(),
                verifiedBy: req.user!.id
            }
        });

        await prisma.user.update({
            where: { id: kyc.userId },
            data: { kycStatus: 'REJECTED' }
        });

        await prisma.adminAuditLog.create({
            data: {
                adminId: req.user!.id,
                action: 'REJECTED_KYC',
                entityType: 'KYC',
                entityId: id,
                details: { reason: rejectionReason }
            }
        });

        res.status(200).json({
            success: true,
            data: kyc,
            message: 'KYC rejected'
        });
    } catch (error) {
        next(error);
    }
};

// Get all transfer requests
export const getAllTransferRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};
        if (status) where.status = status;

        const [requests, total] = await Promise.all([
            prisma.transferRequest.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    ownership: {
                        include: {
                            property: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.transferRequest.count({ where })
        ]);

        res.status(200).json({
            success: true,
            data: requests,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get audit logs
export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [logs, total] = await Promise.all([
            prisma.adminAuditLog.findMany({
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.adminAuditLog.count()
        ]);

        res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};
