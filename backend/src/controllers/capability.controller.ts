import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

/**
 * List capabilities for the authenticated user
 */
export const listCapabilities = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const relationships = await prisma.userCapability.findMany({
            where: { userId },
            include: { capability: true }
        });

        const capabilities = relationships.map(r => r.capability.name);

        res.json({
            success: true,
            data: capabilities
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Unlock a capability for verified users
 */
export const unlockCapability = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { capabilityName } = req.body;

        if (!capabilityName) {
            return next(new AppError('Capability name is required', 400));
        }

        // 1. Check User Verification
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.verificationStatus !== 'approved') {
            return next(new AppError('User must be verified to unlock capabilities', 403));
        }

        // 2. Check if Capability exists
        const capability = await prisma.capability.findUnique({ where: { name: capabilityName } });
        if (!capability) {
            return next(new AppError('Capability not found', 404));
        }

        // 3. Assign if not already assigned
        const existingAssignment = await prisma.userCapability.findFirst({
            where: { userId, capabilityId: capability.id }
        });

        if (existingAssignment) {
            return res.json({
                success: true,
                message: 'Capability already assigned',
                data: { unlockedCapability: capability.name }
            });
        }

        // 4. Transaction: Assign + Audit
        await prisma.$transaction(async (tx) => {
            await tx.userCapability.create({
                data: {
                    userId,
                    capabilityId: capability.id
                }
            });

            // Write to AuditLog (using existing schema model)
            await tx.auditLog.create({
                data: {
                    userId,
                    action: 'CAPABILITY_UNLOCKED',
                    resource: 'capability',
                    details: { capability: capability.name }
                }
            });
        });

        res.json({
            success: true,
            data: { unlockedCapability: capability.name }
        });

    } catch (error) {
        next(error);
    }
};
