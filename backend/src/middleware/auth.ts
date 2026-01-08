import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

export const protect = verifyToken;

export const hasCapability = (requiredCapability: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            // Check if user has the capability
            const userCapability = await prisma.userCapability.findFirst({
                where: {
                    userId: req.user.id,
                    capability: {
                        name: requiredCapability
                    }
                }
            });

            // Super Admins bypass capability checks (optional, but good for safety)
            // For strict RBAC + Capabilities, we might want to check roles too.
            // But user requested Capability SYSTEM.

            const user = await prisma.user.findUnique({ where: { id: req.user.id } });
            if (user?.role === 'SUPER_ADMIN') {
                // Super admin has all powers
                return next();
            }

            if (!userCapability) {
                return res.status(403).json({ error: `Missing capability: ${requiredCapability}` });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: 'Server error checking capabilities' });
        }
    };
};
