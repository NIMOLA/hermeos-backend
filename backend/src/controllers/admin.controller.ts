import { Response, NextFunction } from 'express';
import { PrismaClient, KYCStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { CapabilityService } from '../services/capability.service';

import prisma from '../utils/prisma';

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
            prisma.user.count(),
            prisma.property.count(),
            prisma.transaction.count({ where: { status: 'COMPLETED' } }),
            prisma.kYC.count({ where: { status: 'PENDING' } }),
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

// Start: Invitation Logic
export const inviteAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== 'SUPER_ADMIN') {
            return next(new AppError('Only Super Admins can invite team members', 403));
        }
        const { email, firstName, lastName, role } = req.body;
        if (!['ADMIN', 'MODERATOR'].includes(role)) {
            return next(new AppError('Invalid role. Can only invite ADMIN or MODERATOR', 400));
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return next(new AppError('User with this email already exists', 409));

        const tempPassword = `Temp${Math.random().toString(36).slice(-6)}!`;
        const hashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash(tempPassword, 12));
        const user = await prisma.user.create({
            data: { email, firstName, lastName, password: hashedPassword, role: role as any, tier: 'Tier 1', isVerified: true }
        });
        res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role }, tempPassword } });
    } catch (error) {
        next(error);
    }
};
// End: Invitation Logic

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
        if (kycStatus) where.kycStatus = kycStatus;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where, skip, take: Number(limit),
                select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, tier: true, isVerified: true, kycStatus: true, walletBalance: true, createdAt: true, lastLogin: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);
        res.status(200).json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                kyc: true,
                documents: true,
                ownerships: { include: { property: true } },
                transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
                transferRequests: { orderBy: { createdAt: 'desc' }, take: 10 },
                bankAccounts: true
            }
        });
        if (!user) return next(new AppError('User not found', 404));
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const verifyUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.update({ where: { id }, data: { isVerified: true, verificationStatus: 'approved' } });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await prisma.user.update({ where: { id }, data: { role } });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const getPendingKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            where: { kycStatus: 'pending' },
            select: { id: true, email: true, firstName: true, lastName: true, kycStatus: true, createdAt: true }
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

// Start: Strict KYC Workflow
export const reviewKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const note = req.body.note || 'Reviewed by Moderator';
        if (!['MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
            return next(new AppError('Only Moderators/Admins can submit for review', 403));
        }
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return next(new AppError('User not found', 404));
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { kycStatus: 'pending_admin_review', verificationStatus: 'pending' }
        });
        console.log(`[AUDIT] KYC Reviewed by ${req.user?.email} for user ${user.email}. Note: ${note}`);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};



export const rejectKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
            return next(new AppError('Only Admins can reject applications', 403));
        }

        // 1. Update User Status
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { kycStatus: 'rejected', isVerified: false, verificationStatus: 'rejected' }
        });

        // 2. Update KYC Record (Sync Rejection Reason)
        // Find latest KYC record for user
        const kycRecord = await prisma.kYC.findFirst({
            where: { userId: id },
            orderBy: { createdAt: 'desc' }
        });

        if (kycRecord) {
            await prisma.kYC.update({
                where: { id: kycRecord.id },
                data: {
                    status: 'REJECTED',
                    rejectionReason: reason,
                    reviewedAt: new Date(),
                    reviewedBy: req.user?.id
                }
            });
        }

        // 3. Notify User
        await prisma.notification.create({
            data: {
                userId: id,
                title: 'KYC Application Rejected',
                message: `Your KYC application was rejected. Reason: ${reason || 'Document validation failed'}`,
                type: 'error'
            }
        });

        console.log(`[AUDIT] KYC Rejected by ${req.user?.email}. Reason: ${reason}`);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const approveKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
            return next(new AppError('Only Admins can approve applications', 403));
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return next(new AppError('User not found', 404));

        if (user.kycStatus !== 'pending_admin_review') {
            // Optional: allow approval if just pending, but strict flow prefers review first.
            // Continuing with Strict Flow assumption from previous session
            return next(new AppError('Application must be reviewed by moderator first (status: pending_admin_review)', 400));
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                kycStatus: 'verified',
                isVerified: true,
                verificationStatus: 'verified'
            }
        });

        // Notify User
        await prisma.notification.create({
            data: {
                userId: id,
                title: 'KYC Approved',
                message: 'Your identity has been verified. You can now invest.',
                type: 'success'
            }
        });

        console.log(`[AUDIT] KYC Approved for user ${user.email} by ${req.user?.email}`);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};
// End: Strict KYC Workflow

export const getAllTransferRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const requests = await prisma.transferRequest.findMany({
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, property: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ success: true, data: [] });
    } catch (error) {
        next(error);
    }
};
