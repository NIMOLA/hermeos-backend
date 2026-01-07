import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';
import { AppError } from './errorHandler';
export { requireRole } from './requireRole';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: UserRole;
    };
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            role: UserRole;
        };

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                isVerified: true
            }
        });

        if (!user) {
            return next(new AppError('User no longer exists', 401));
        }

        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return next(new AppError('Not authorized to access this route', 401));
    }
};

export const authorize = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            // No token, continue without user
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            role: UserRole;
        };

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                isVerified: true
            }
        });

        if (user) {
            // Attach user to request
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role
            };
        }

        next();
    } catch (error) {
        // Token invalid, continue without user
        next();
    }
};

export const requireCapability = (capabilityName: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new AppError('Not authorized', 401));
            }

            // Admins bypass capability checks
            if (['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
                return next();
            }

            const hasCap = await prisma.userCapability.findFirst({
                where: {
                    userId: req.user.id,
                    capability: {
                        name: capabilityName
                    }
                }
            });

            if (!hasCap) {
                return next(new AppError(`Missing required capability: ${capabilityName}`, 403));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
