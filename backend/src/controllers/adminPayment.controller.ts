import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logFinancialEvent, logSecurityEvent } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Get all pending payment proofs (Admin only)
 */
export const getPendingPaymentProofs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const proofs = await prisma.paymentProof.findMany({
            where: { status: 'pending' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                property: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        pricePerUnit: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            count: proofs.length,
            data: proofs.map(p => ({
                id: p.id,
                user: p.user,
                property: p.property,
                units: p.units,
                amount: Number(p.amount),
                depositorName: p.depositorName,
                transferDate: p.transferDate,
                transferReference: p.transferReference,
                createdAt: p.createdAt
            }))
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get payment proof details (Admin only)
 */
export const getPaymentProofDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const proof = await prisma.paymentProof.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                },
                property: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        pricePerUnit: true,
                        availableUnits: true
                    }
                }
            }
        });

        if (!proof) {
            return next(new AppError('Payment proof not found', 404));
        }

        res.json({
            success: true,
            data: {
                id: proof.id,
                user: proof.user,
                property: proof.property,
                units: proof.units,
                amount: Number(proof.amount),
                depositorName: proof.depositorName,
                transferDate: proof.transferDate,
                transferReference: proof.transferReference,
                status: proof.status,
                verifiedBy: proof.verifiedBy,
                verifiedAt: proof.verifiedAt,
                rejectionReason: proof.rejectionReason,
                createdAt: proof.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify/Approve payment proof (Admin only)
 */
export const verifyPaymentProof = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const adminId = req.user!.id;

        const proof = await prisma.paymentProof.findUnique({
            where: { id },
            include: { property: true, user: true }
        });

        if (!proof) {
            return next(new AppError('Payment proof not found', 404));
        }

        if (proof.status !== 'pending') {
            return next(new AppError('Payment proof already processed', 400));
        }

        // Check if property has enough units
        if (proof.property.availableUnits < proof.units) {
            return next(new AppError('Insufficient units available', 400));
        }

        // Process in transaction
        await prisma.$transaction(async (tx) => {
            // Update payment proof status
            await tx.paymentProof.update({
                where: { id },
                data: {
                    status: 'verified',
                    verifiedBy: adminId,
                    verifiedAt: new Date()
                }
            });

            // Deduct property units
            await tx.property.update({
                where: { id: proof.propertyId },
                data: {
                    availableUnits: { decrement: proof.units }
                }
            });

            // Create or update ownership
            const existingOwnership = await tx.ownership.findFirst({
                where: {
                    userId: proof.userId,
                    propertyId: proof.propertyId
                }
            });

            if (existingOwnership) {
                await tx.ownership.update({
                    where: { id: existingOwnership.id },
                    data: {
                        units: { increment: proof.units }
                    }
                });
            } else {
                await tx.ownership.create({
                    data: {
                        userId: proof.userId,
                        propertyId: proof.propertyId,
                        units: proof.units,
                        acquisitionPrice: proof.amount,
                        acquisitionDate: new Date()
                    }
                });
            }

            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: proof.userId,
                    propertyId: proof.propertyId,
                    type: 'OWNERSHIP_REGISTRATION',
                    amount: proof.amount,
                    status: 'COMPLETED',
                    paymentMethod: 'bank_transfer',
                    description: `Bank transfer payment for ${proof.units} units - Verified by admin`
                }
            });

            // Notify user
            await tx.notification.create({
                data: {
                    userId: proof.userId,
                    title: 'Payment Verified',
                    message: `Your bank transfer of ₦${Number(proof.amount).toLocaleString()} has been verified. ${proof.units} units added to your portfolio.`,
                    type: 'success'
                }
            });
        });

        logFinancialEvent('Payment proof verified', proof.userId, Number(proof.amount), {
            proofId: id,
            adminId,
            propertyId: proof.propertyId,
            units: proof.units
        });

        res.json({
            success: true,
            message: 'Payment verified and ownership created'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reject payment proof (Admin only)
 */
export const rejectPaymentProof = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const adminId = req.user!.id;

        if (!reason) {
            return next(new AppError('Rejection reason is required', 400));
        }

        const proof = await prisma.paymentProof.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!proof) {
            return next(new AppError('Payment proof not found', 404));
        }

        if (proof.status !== 'pending') {
            return next(new AppError('Payment proof already processed', 400));
        }

        await prisma.$transaction(async (tx) => {
            // Update payment proof status
            await tx.paymentProof.update({
                where: { id },
                data: {
                    status: 'rejected',
                    verifiedBy: adminId,
                    verifiedAt: new Date(),
                    rejectionReason: reason
                }
            });

            // Notify user
            await tx.notification.create({
                data: {
                    userId: proof.userId,
                    title: 'Payment Rejected',
                    message: `Your bank transfer proof has been rejected. Reason: ${reason}`,
                    type: 'error'
                }
            });
        });

        logSecurityEvent('Payment proof rejected', {
            proofId: id,
            adminId,
            userId: proof.userId,
            reason
        });

        res.json({
            success: true,
            message: 'Payment proof rejected'
        });
    } catch (error) {
        next(error);
    }
};
