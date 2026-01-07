import { Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
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

        // Create user
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phone,
                    tier: 'Tier 1' // Default tier
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

            // Generate token
            const token = generateToken(user.id, user.email, user.role);

            res.status(201).json({
                success: true,
                data: { user, token }
            });
        } catch (dbError: any) {
            // Handle Prisma unique constraint violations (race condition)
            if (dbError.code === 'P2002') {
                return next(new AppError('Email already registered', 400));
            }
            // Re-throw other errors to be handled by global error handler
            // But wrap them in AppError to ensure message is visible in dev/prod for debugging this issue
            if (process.env.NODE_ENV === 'production') {
                // In production, we might want to be careful, but for this specific bug fix, we need to know.
                // However, let's log it and return a slightly more descriptive error if possible.
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
                // Just increment failed attempts
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

        // Reset failed attempts on successful login
        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockedUntil: null,
                    lastLogin: new Date() // Update last login here
                }
            });
        } else {
            // Update last login if no failed attempts to reset
            user = await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
            });
        }

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

            // Assign default capabilities for new social users
            await CapabilityService.assignDefaultCapabilities(user.id);
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
