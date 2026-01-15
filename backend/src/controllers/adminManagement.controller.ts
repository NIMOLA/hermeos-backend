import { Response, NextFunction } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
    logSecurityEvent,
    logAdminAction
} from '../utils/logger';

// ... (existing imports)

// ...

/**
 * Suspend/Activate User
 */
export const suspendUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        /* @ts-ignore */
        const adminId = req.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return next(new AppError('User not found', 404));

        const isSuspended = !!user.lockedUntil && user.lockedUntil > new Date();
        const newLockedUntil = isSuspended ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year lock

        await prisma.user.update({
            where: { id: userId },
            data: { lockedUntil: newLockedUntil }
        });

        // Log Action
        await logAdminAction(adminId, isSuspended ? 'ACTIVATE_USER' : 'SUSPEND_USER', { targetUserId: userId }, { type: 'USER', id: userId });

        res.json({ success: true, message: isSuspended ? 'User activated' : 'User suspended' });
    } catch (e) { next(e); }
};

/**
 * Update User Profile
 */
export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        /* @ts-ignore */
        const adminId = req.user.id;
        const { firstName, lastName, phone, address, state, lga, dateOfBirth } = req.body;

        await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
                address,
                state,
                lga,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
            }
        });

        // Log Action
        await logAdminAction(adminId, 'UPDATE_USER_PROFILE', { targetUserId: userId, updates: Object.keys(req.body) }, { type: 'USER', id: userId });

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (e) { next(e); }
};

const prisma = new PrismaClient();

const SUPER_ADMIN_KEY = 'mces2024!dev';

/**
 * Initialize super admin (first time setup)
 */
export const initializeSuperAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName, masterKey } = req.body;

        // Verify master key
        if (masterKey !== SUPER_ADMIN_KEY) {
            logSecurityEvent('Failed super admin initialization - invalid master key', {
                email,
                ip: req.ip
            });
            return next(new AppError('Invalid master key', 403));
        }

        // Check if super admin already exists
        const existingSuperAdmin = await prisma.user.findFirst({
            where: { role: 'SUPER_ADMIN' }
        });

        if (existingSuperAdmin) {
            return next(new AppError('Super admin already exists', 400));
        }

        // Create super admin
        const hashedPassword = await bcrypt.hash(password, 12);

        const superAdmin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'SUPER_ADMIN',
                isVerified: true,
                kycStatus: 'verified'
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });

        logSecurityEvent('Super admin created', {
            adminId: superAdmin.id,
            email: superAdmin.email
        });

        res.status(201).json({
            success: true,
            data: { admin: superAdmin },
            message: 'Super admin account created successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create admin invitation (super admin only)
 */
export const createAdminInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, role, permissions } = req.body;
        const creatorId = req.user!.id;

        // Verify creator is super admin
        if (req.user!.role !== 'SUPER_ADMIN') {
            return next(new AppError('Only super admin can create admin invitations', 403));
        }

        // Validate role
        const validRoles = ['ADMIN', 'MODERATOR', 'SUPPORT'];
        if (!validRoles.includes(role)) {
            return next(new AppError('Invalid admin role', 400));
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return next(new AppError('User with this email already exists', 400));
        }

        // Generate invitation token
        const invitationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Create admin invitation record
        const invitation = await prisma.adminInvitation.create({
            data: {
                email,
                role,
                permissions: permissions || [],
                token: invitationToken,
                createdBy: creatorId,
                expiresAt
            }
        });

        // Generate invitation link
        const invitationLink = `${process.env.CLIENT_URL}/admin/accept-invitation/${invitationToken}`;

        logSecurityEvent('Admin invitation created', {
            creatorId,
            invitedEmail: email,
            role,
            invitationId: invitation.id
        });

        res.status(201).json({
            success: true,
            data: {
                invitation: {
                    id: invitation.id,
                    email: invitation.email,
                    role: invitation.role,
                    invitationLink,
                    expiresAt: invitation.expiresAt
                }
            },
            message: 'Admin invitation created. Send this link to the new admin.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Accept admin invitation and create account
 */
export const acceptAdminInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const { password, firstName, lastName } = req.body;

        // Find invitation
        const invitation = await prisma.adminInvitation.findUnique({
            where: { token }
        });

        if (!invitation) {
            return next(new AppError('Invalid invitation token', 404));
        }

        if (invitation.used) {
            return next(new AppError('This invitation has already been used', 400));
        }

        if (new Date() > invitation.expiresAt) {
            return next(new AppError('This invitation has expired', 400));
        }

        // Create admin account
        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await prisma.user.create({
            data: {
                email: invitation.email,
                password: hashedPassword,
                firstName,
                lastName,
                role: invitation.role as UserRole,
                isVerified: true,
                kycStatus: 'verified'
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });

        // Mark invitation as used
        await prisma.adminInvitation.update({
            where: { id: invitation.id },
            data: { used: true }
        });

        logSecurityEvent('Admin invitation accepted', {
            adminId: admin.id,
            email: admin.email,
            role: admin.role,
            invitationId: invitation.id
        });

        res.status(201).json({
            success: true,
            data: { admin },
            message: 'Admin account created successfully. You can now log in.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * List all admins (super admin only)
 */
export const listAdmins = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (req.user!.role !== 'SUPER_ADMIN') {
            return next(new AppError('Only super admin can view all admins', 403));
        }

        const admins = await prisma.user.findMany({
            where: {
                role: {
                    in: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']
                }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                lastLogin: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            success: true,
            data: { admins }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update admin role/permissions (super admin only)
 */
export const updateAdminRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { adminId } = req.params;
        const { role } = req.body;

        if (req.user!.role !== 'SUPER_ADMIN') {
            return next(new AppError('Only super admin can update admin roles', 403));
        }

        const validRoles = ['ADMIN', 'MODERATOR', 'SUPPORT'];
        if (!validRoles.includes(role)) {
            return next(new AppError('Invalid role', 400));
        }

        const admin = await prisma.user.update({
            where: { id: adminId },
            data: { role },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });

        logSecurityEvent('Admin role updated', {
            updatedBy: req.user!.id,
            adminId,
            newRole: role
        });

        res.json({
            success: true,
            data: { admin },
            message: 'Admin role updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Revoke admin access (super admin only)
 */
export const revokeAdminAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { adminId } = req.params;

        if (req.user!.role !== 'SUPER_ADMIN') {
            return next(new AppError('Only super admin can revoke admin access', 403));
        }

        // Don't allow revoking super admin
        const admin = await prisma.user.findUnique({
            where: { id: adminId }
        });

        if (admin?.role === 'SUPER_ADMIN') {
            return next(new AppError('Cannot revoke super admin access', 400));
        }

        await prisma.user.update({
            where: { id: adminId },
            data: { role: 'USER' }
        });

        logSecurityEvent('Admin access revoked', {
            revokedBy: req.user!.id,
            adminId
        });

        res.json({
            success: true,
            message: 'Admin access revoked successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get detailed user profile (Admin)
 */
export const getAdminUserDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                kyc: true,
                documents: true,
                ownerships: { include: { property: true } },
                transactions: { orderBy: { createdAt: 'desc' } },
                bankAccounts: true
            }
        });
        if (!user) return next(new AppError('User not found', 404));

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};



/**
 * Get Admin Audit Logs
 */
export const getAdminAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            prisma.adminAuditLog.findMany({
                skip,
                take: limit,
                include: {
                    admin: {
                        select: { firstName: true, lastName: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.adminAuditLog.count()
        ]);

        res.json({
            success: true,
            data: logs,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (e) { next(e); }
};
