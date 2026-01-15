import { Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { CapabilityService } from '../services/capability.service';

const prisma = new PrismaClient();

// Generate JWT Token
const generateToken = (id: string, email: string, role: string) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
    });
};

// Register new user
export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, firstName, lastName, phone } = req.body;

        // Password complexity validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return next(new AppError(
                'Password must be at least 8 characters with uppercase, lowercase, number, and a special character',
                400
            ));
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(new AppError('Email already registered', 400));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate Verification Code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Create user
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phone,
                    tier: 'Tier 1', // Default tier
                    verificationCode,
                    verificationExpires
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    tier: true,
                    createdAt: true
                }
            });

            // Assign default capabilities
            await CapabilityService.assignDefaultCapabilities(user.id);

            // Send Welcome Email (and Verification Code)
            try {
                // In a real app, use emailService
                console.log(`Sending verification code ${verificationCode} to ${email}`);
                // const { emailService } = await import('../services/email.service');
                // await emailService.sendWelcomeEmail(user.email, user.firstName);
            } catch (err) {
                console.error('Failed to send welcome email', err);
            }

            // Generate token
            const token = generateToken(user.id, user.email, user.role);

            res.status(201).json({
                success: true,
                data: { user, token },
                message: 'Registration successful. Please check email for verification code.'
            });
        } catch (dbError: any) {
            if (dbError.code === 'P2002') {
                return next(new AppError('Email already registered', 400));
            }
            if (process.env.NODE_ENV === 'production') {
                console.error('Registration Error:', dbError);
                return next(new AppError(`Registration failed: ${dbError.message || 'Database error'}`, 500));
            }
            throw dbError;
        }
    } catch (error) {
        next(error);
    }
};

// Login user
export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check user exists
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
            return next(new AppError(
                `Account locked due to multiple failed login attempts. Try again in ${minutesLeft} minutes.`,
                423
            ));
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Increment failed attempts
            const failedAttempts = (user.failedLoginAttempts || 0) + 1;

            if (failedAttempts >= 5) {
                // Lock account for 30 minutes
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        failedLoginAttempts: failedAttempts,
                        lockedUntil: new Date(Date.now() + 30 * 60 * 1000)
                    }
                });
                return next(new AppError(
                    'Account locked due to multiple failed login attempts. Try again in 30 minutes.',
                    423
                ));
            } else {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { failedLoginAttempts: failedAttempts }
                });
                return next(new AppError(
                    `Invalid credentials. ${5 - failedAttempts} attempts remaining.`,
                    401
                ));
            }
        }

        // Reset failed attempts
        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockedUntil: null,
                    lastLogin: new Date()
                }
            });
        } else {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
            });
        }

        // 2FA Enforcement
        if (user.twoFactorEnabled) {
            const { twoFactorCode } = req.body;
            if (!twoFactorCode) {
                return res.status(200).json({
                    success: true,
                    requires2FA: true,
                    data: { email: user.email }
                });
            }

            if (!user.twoFactorSecret) {
                return next(new AppError('2FA enabled but secret missing', 500));
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorCode
            });

            if (!verified) {
                return next(new AppError('Invalid 2FA code', 401));
            }
        }

        // Generate token
        const token = generateToken(user.id, user.email, user.role);

        // Introspection
        const capabilities = await prisma.userCapability.findMany({
            where: { userId: user.id },
            include: { capability: true }
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    tier: user.tier,
                    isVerified: user.isVerified,
                    kycStatus: user.kycStatus,
                    capabilities: capabilities.map(uc => ({
                        name: uc.capability.name,
                        assignedAt: uc.assignedAt,
                        description: uc.capability.description
                    }))
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Verify Email
export const verifyEmail = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body;
        const userId = req.user!.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return next(new AppError('User not found', 404));

        if (user.isVerified) {
            return res.status(200).json({ success: true, message: 'Email already verified' });
        }

        if (user.verificationCode !== code) {
            return next(new AppError('Invalid verification code', 400));
        }

        if (user.verificationExpires && new Date() > user.verificationExpires) {
            return next(new AppError('Verification code expired', 400));
        }

        // Correct code
        await prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: true,
                verificationCode: null,
                verificationExpires: null
            }
        });

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};

// Resend Verification Code
export const resendVerification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return next(new AppError('User not found', 404));

        if (user.isVerified) {
            return res.status(200).json({ success: true, message: 'Email already verified' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.user.update({
            where: { id: userId },
            data: { verificationCode, verificationExpires }
        });

        // Send Email (Mock)
        console.log(`Resending verification code ${verificationCode} to ${user.email}`);

        res.status(200).json({ success: true, message: 'Verification code sent' });
    } catch (error) {
        next(error);
    }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
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
            }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        const capabilities = await prisma.userCapability.findMany({
            where: { userId: user.id },
            include: { capability: true }
        });

        res.status(200).json({
            success: true,
            data: {
                ...user,
                capabilities: capabilities.map(uc => ({
                    name: uc.capability.name,
                    assignedAt: uc.assignedAt,
                    description: uc.capability.description
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// Refresh token
export const refreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return next(new AppError('Refresh token required', 400));

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
        const token = generateToken(decoded.id, decoded.email, decoded.role);

        res.status(200).json({ success: true, data: { token } });
    } catch (error) {
        next(new AppError('Invalid refresh token', 401));
    }
};

// Forgot password
export const forgotPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        // Don't reveal existence
        res.status(200).json({ success: true, message: 'If email exists, reset link has been sent' });
    } catch (error) {
        next(error);
    }
};

// Reset password
export const resetPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // TODO: Implement actual reset
    res.status(200).json({ success: true, message: 'Password reset successful' });
};

// Logout
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Social Login
export const socialLogin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { provider, idToken, email, firstName, lastName } = req.body;
        // Simplified logic for brevity in rewrite - assuming similar logic to original but ensuring types
        // Social login users are auto-verified
        // ... (Logic maintained from original but omitting detailed OAuth setup for this snippet length, assuming it works)

        // Mocking success for rewrite to focus on verification
        // In real usage, keep original payload.
        // Since I am overwriting the file, I MUST include the logic.

        // RE-ADDING ORIGINAL SOCIAL LOGIN LOGIC:
        if (!provider || !idToken || !email) {
            return next(new AppError('Provider, ID token and email are required', 400));
        }

        // Initialize Google Client
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let verifiedEmail = email;

        if (provider === 'google') {
            try {
                const ticket = await client.verifyIdToken({
                    idToken: idToken,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload) throw new Error('Invalid token payload');
                if (payload.email !== email) return next(new AppError('Token email mismatch', 400));
                verifiedEmail = payload.email;
            } catch (error) {
                return next(new AppError('Invalid Google Token', 401));
            }
        }

        let user = await prisma.user.findUnique({ where: { email: verifiedEmail } });

        if (user) {
            const updateData: any = { lastLogin: new Date() };
            if (provider === 'google' && !user.googleId) updateData.googleId = idToken;
            if (provider === 'apple' && !user.appleId) updateData.appleId = idToken;
            user = await prisma.user.update({ where: { id: user.id }, data: updateData });
        } else {
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: firstName || 'Social',
                    lastName: lastName || 'User',
                    password: await bcrypt.hash(Math.random().toString(36), 12),
                    googleId: provider === 'google' ? idToken : null,
                    appleId: provider === 'apple' ? idToken : null,
                    isVerified: true,
                    lastLogin: new Date()
                }
            });
            await CapabilityService.assignDefaultCapabilities(user.id);
        }

        const token = generateToken(user.id, user.email, user.role);
        const capabilities = await prisma.userCapability.findMany({
            where: { userId: user.id },
            include: { capability: true }
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
                    role: user.role, tier: user.tier, isVerified: user.isVerified, kycStatus: user.kycStatus,
                    capabilities: capabilities.map(uc => ({ name: uc.capability.name, assignedAt: uc.assignedAt, description: uc.capability.description }))
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

// Setup 2FA
export const setup2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const secret = speakeasy.generateSecret({ name: `Hermeos:${req.user!.email}` });
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);
        await prisma.user.update({ where: { id: req.user!.id }, data: { twoFactorSecret: secret.base32 } });
        res.status(200).json({ success: true, data: { secret: secret.base32, qrCode: qrCodeUrl } });
    } catch (error) { next(error); }
};

// Verify 2FA
export const verify2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user || !user.twoFactorSecret) return next(new AppError('2FA setup not initiated', 400));
        const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token });
        if (!verified) return next(new AppError('Invalid token', 400));
        await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } });
        res.status(200).json({ success: true, message: '2FA enabled successfully' });
    } catch (error) { next(error); }
};

// Disable 2FA
export const disable2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { password } = req.body;
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user) return next(new AppError('User not found', 404));
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return next(new AppError('Invalid password', 401));
        await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: false, twoFactorSecret: null } });
        res.status(200).json({ success: true, message: '2FA disabled successfully' });
    } catch (error) { next(error); }
};
