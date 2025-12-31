import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logSecurityEvent } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Generate 2FA secret and QR code
 */
export const setup2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (user.twoFactorEnabled) {
            return next(new AppError('2FA is already enabled', 400));
        }

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `Hermeos (${user.email})`,
            issuer: 'Hermeos Proptech'
        });

        // Save secret temporarily (not enabled yet)
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret.base32 }
        });

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

        logSecurityEvent('2FA setup initiated', {
            userId,
            email: user.email
        });

        res.json({
            success: true,
            data: {
                secret: secret.base32,
                qrCode: qrCodeUrl,
                manualEntryKey: secret.base32
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify 2FA token and enable
 */
export const verify2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        const userId = req.user!.id;

        if (!token) {
            return next(new AppError('2FA token is required', 400));
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.twoFactorSecret) {
            return next(new AppError('2FA not set up', 400));
        }

        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2 // Allow 2 time steps before/after
        });

        if (!verified) {
            logSecurityEvent('2FA verification failed', {
                userId,
                email: user.email
            });
            return next(new AppError('Invalid 2FA token', 401));
        }

        // Enable 2FA
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true }
        });

        logSecurityEvent('2FA enabled', {
            userId,
            email: user.email
        });

        res.json({
            success: true,
            message: '2FA enabled successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Validate 2FA token during login
 */
export const validate2FAToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return next(new AppError('Email and token are required', 400));
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
            return next(new AppError('2FA not enabled for this account', 400));
        }

        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2
        });

        if (!verified) {
            logSecurityEvent('2FA login verification failed', {
                userId: user.id,
                email: user.email
            });
            return next(new AppError('Invalid 2FA token', 401));
        }

        res.json({
            success: true,
            verified: true
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Disable 2FA
 */
export const disable2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { password, token } = req.body;
        const userId = req.user!.id;

        if (!password || !token) {
            return next(new AppError('Password and 2FA token are required', 400));
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (!user.twoFactorEnabled) {
            return next(new AppError('2FA is not enabled', 400));
        }

        // Verify password
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return next(new AppError('Invalid password', 401));
        }

        // Verify 2FA token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret!,
            encoding: 'base32',
            token: token,
            window: 2
        });

        if (!verified) {
            return next(new AppError('Invalid 2FA token', 401));
        }

        // Disable 2FA
        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null
            }
        });

        logSecurityEvent('2FA disabled', {
            userId,
            email: user.email
        });

        res.json({
            success: true,
            message: '2FA disabled successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get 2FA status
 */
export const get2FAStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                twoFactorEnabled: true
            }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.json({
            success: true,
            data: {
                enabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        next(error);
    }
};
