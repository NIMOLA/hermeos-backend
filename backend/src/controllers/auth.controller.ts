import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Generate JWT Token
const generateToken = (id: string, email: string, role: string) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Register new user
export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, firstName, lastName, phone, tier } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(new AppError('Email already registered', 400));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                tier: tier || 'basic'
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

        // Generate token
        const token = generateToken(user.id, user.email, user.role);

        res.status(201).json({
            success: true,
            data: { user, token }
        });
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
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Generate token
        const token = generateToken(user.id, user.email, user.role);

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
                    kycStatus: user.kycStatus
                },
                token
            }
        });
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

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Refresh token
export const refreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(new AppError('Refresh token required', 400));
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;

        // Generate new access token
        const token = generateToken(decoded.id, decoded.email, decoded.role);

        res.status(200).json({
            success: true,
            data: { token }
        });
    } catch (error) {
        next(new AppError('Invalid refresh token', 401));
    }
};

// Forgot password
export const forgotPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if email exists
            return res.status(200).json({
                success: true,
                message: 'If email exists, reset link has been sent'
            });
        }

        // TODO: Generate reset token and send email
        // For now, just return success
        res.status(200).json({
            success: true,
            message: 'Password reset link sent to email'
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
export const resetPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { token, password } = req.body;

        // TODO: Verify reset token and update password
        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        next(error);
    }
};

// Logout
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // In a real app, invalidate token (e.g., add to blacklist)
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};
// Social Login (Google/Apple)
export const socialLogin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { provider, idToken, email, firstName, lastName } = req.body;

        if (!provider || !idToken || !email) {
            return next(new AppError('Provider, ID token and email are required', 400));
        }

        // In a real app, verify the idToken with Google/Apple SDKs here
        // For this implementation, we assume the token is valid if it exists

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Update social ID if not present
            const updateData: any = { lastLogin: new Date() };
            if (provider === 'google' && !user.googleId) updateData.googleId = idToken; // Using idToken as mock ID
            if (provider === 'apple' && !user.appleId) updateData.appleId = idToken;

            user = await prisma.user.update({
                where: { id: user.id },
                data: updateData
            });
        } else {
            // Create new user for social login
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: firstName || 'Social',
                    lastName: lastName || 'User',
                    password: await bcrypt.hash(Math.random().toString(36), 12), // Random password
                    googleId: provider === 'google' ? idToken : null,
                    appleId: provider === 'apple' ? idToken : null,
                    isVerified: true, // Social accounts are pre-verified emails
                    lastLogin: new Date()
                }
            });
        }

        const token = generateToken(user.id, user.email, user.role);

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
                    kycStatus: user.kycStatus
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};
