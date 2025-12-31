import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logAuthEvent } from '../utils/logger';

const prisma = new PrismaClient();

// Generate Access Token (15 minutes)
const generateAccessToken = (id: string, email: string, role: string) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
        expiresIn: '15m'
    });
};

// Generate Refresh Token (7 days)
const generateRefreshToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    });
};

// Set HTTP-only cookies
const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
    // Access token cookie (15 minutes)
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Refresh token cookie (7 days)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

// Register new user with httpOnly cookies
export const registerWithCookies = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, firstName, lastName, phone, tier } = req.body;

        // Password complexity validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return next(new AppError(
                'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)',
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

        // Generate tokens
        const accessToken = generateAccessToken(user.id, user.email, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        logAuthEvent('User registered', user.id, req.ip || 'unknown', true);

        res.status(201).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// Login with httpOnly cookies
export const loginWithCookies = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check user exists
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            logAuthEvent('Login failed - user not found', null, req.ip || 'unknown', false);
            return next(new AppError('Invalid credentials', 401));
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
            logAuthEvent('Login blocked - account locked', user.id, req.ip || 'unknown', false);
            return next(new AppError(
                `Account locked due to multiple failed login attempts. Try again in ${minutesLeft} minutes.`,
                423
            ));
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const failedAttempts = (user.failedLoginAttempts || 0) + 1;

            if (failedAttempts >= 5) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        failedLoginAttempts: failedAttempts,
                        lockedUntil: new Date(Date.now() + 30 * 60 * 1000)
                    }
                });
                logAuthEvent('Account locked', user.id, req.ip || 'unknown', false);
                return next(new AppError(
                    'Account locked due to multiple failed login attempts. Try again in 30 minutes.',
                    423
                ));
            } else {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { failedLoginAttempts: failedAttempts }
                });
                logAuthEvent('Login failed - invalid password', user.id, req.ip || 'unknown', false);
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

        // Generate tokens
        const accessToken = generateAccessToken(user.id, user.email, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        logAuthEvent('Login successful', user.id, req.ip || 'unknown', true);

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
                    twoFactorEnabled: user.twoFactorEnabled
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Refresh access token
export const refreshAccessToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return next(new AppError('Refresh token not found', 401));
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { id: string };

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user.id, user.email, user.role);

        // Set new access token cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.json({
            success: true,
            message: 'Access token refreshed'
        });
    } catch (error) {
        next(error);
    }
};

// Logout - clear cookies
export const logoutWithCookies = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        if (req.user) {
            logAuthEvent('Logout', req.user.id, req.ip || 'unknown', true);
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};
