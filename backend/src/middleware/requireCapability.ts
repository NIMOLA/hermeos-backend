import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from './errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requireCapability = (requiredCapability: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new AppError('Authentication required', 401));
            }

            // Check if user has the capability
            const count = await prisma.userCapability.count({
                where: {
                    userId: req.user.id,
                    capability: { name: requiredCapability }
                }
            });

            if (count === 0) {
                return next(new AppError(`Forbidden - capability required: ${requiredCapability}`, 403));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
