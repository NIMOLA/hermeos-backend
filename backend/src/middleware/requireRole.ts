import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from './errorHandler';

/**
 * Middleware to require specific roles
 * Usage: router.get('/admin', protect, requireRole(['ADMIN', 'SUPER_ADMIN']), handler)
 */
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Not authenticated', 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError('Insufficient permissions', 403));
        }

        next();
    };
};
