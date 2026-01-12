import { Response, NextFunction } from 'express';
import { PrismaClient, TransferStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Create transfer request
// Create transfer request
export const createTransferRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Disabled in favor of ExitRequest workflow
    return next(new AppError('Transfer request creation via this endpoint is deprecated. Use Exit Request.', 501));
};

// Get user's transfer requests
export const getMyTransferRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const requests = await prisma.transferRequest.findMany({
            where: { userId: req.user!.id },
            include: {
                ownership: {
                    include: { property: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        next(error);
    }
};

// Get transfer request by ID
export const getTransferRequestById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const request = await prisma.transferRequest.findUnique({
            where: { id },
            include: {
                ownership: {
                    include: { property: true }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        if (!request) {
            return next(new AppError('Transfer request not found', 404));
        }

        // Authorization check
        if (request.userId !== req.user!.id && req.user!.role === 'USER') {
            return next(new AppError('Not authorized', 403));
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        next(error);
    }
};

// Approve transfer request (Admin)
export const approveTransferRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const transferRequest = await prisma.transferRequest.findUnique({
            where: { id },
            include: { ownership: true }
        });

        if (!transferRequest) {
            return next(new AppError('Transfer request not found', 404));
        }

        if (transferRequest.status !== 'PENDING') {
            return next(new AppError('Transfer request already processed', 400));
        }

        // Execute Transfer/Exit Logic in Transaction
        const updated = await prisma.$transaction(async (tx) => {
            // 1. Update Request Status
            const reqUpdate = await tx.transferRequest.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    reviewedBy: req.user!.id,
                    reviewedAt: new Date()
                },
                include: { ownership: true }
            });

            if (!reqUpdate.ownershipId) {
                throw new AppError('Transfer request missing ownership reference', 400);
            }

            // 2. Decrement Ownership
            const ownership = await tx.ownership.findUnique({
                where: { id: reqUpdate.ownershipId }
            });

            if (!ownership || ownership.units < reqUpdate.units) {
                throw new AppError('Ownership units insufficient or not found during processing', 400);
            }

            const newUnits = ownership.units - reqUpdate.units;
            if (newUnits > 0) {
                await tx.ownership.update({
                    where: { id: ownership.id },
                    data: { units: newUnits }
                });
            } else {
                // Mark as sold out/inactive
                await tx.ownership.update({
                    where: { id: ownership.id },
                    data: { units: 0, status: 'sold_out' }
                });
            }

            // 3. Credit User Wallet
            // We assume 'requestedPrice' is the agreed payout amount
            if (reqUpdate.requestedPrice) {
                await tx.user.update({
                    where: { id: reqUpdate.userId },
                    data: { walletBalance: { increment: reqUpdate.requestedPrice } }
                });

                await tx.transaction.create({
                    data: {
                        userId: reqUpdate.userId,
                        type: 'TRANSFER_REQUEST',
                        amount: reqUpdate.requestedPrice,
                        status: 'COMPLETED',
                        description: `Proceeds from sale of ${reqUpdate.units} units`,
                        reference: `EXIT-${reqUpdate.id.substring(0, 8)}`
                    }
                });
            }

            return reqUpdate;
        });

        // Create notification
        await prisma.notification.create({
            data: {
                userId: updated.userId,
                title: 'Transfer Request Approved',
                message: `Your transfer request for ${updated.units} units has been approved. Funds have been credited to your wallet.`,
                type: 'success'
            }
        });

        // Send Email
        try {
            const { emailService } = await import('../services/email.service');
            const user = await prisma.user.findUnique({ where: { id: updated.userId } });
            if (user) {
                await emailService.sendEmail(
                    user.email,
                    'Transfer Request Approved',
                    `<p>Your transfer request for ${updated.units} units has been approved and funds credited.</p>`
                );
            }
        } catch (err) {
            console.error('Failed to send transfer email', err);
        }

        res.status(200).json({
            success: true,
            data: updated,
            message: 'Transfer request approved and processed'
        });
    } catch (error) {
        next(error);
    }
};

// Reject transfer request (Admin)
export const rejectTransferRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        const transferRequest = await prisma.transferRequest.findUnique({
            where: { id }
        });

        if (!transferRequest) {
            return next(new AppError('Transfer request not found', 404));
        }

        if (transferRequest.status !== 'PENDING') {
            return next(new AppError('Transfer request already processed', 400));
        }

        const updated = await prisma.transferRequest.update({
            where: { id },
            data: {
                status: 'REJECTED',
                reviewedBy: req.user!.id,
                reviewedAt: new Date(),
                rejectionReason
            }
        });

        // Create notification
        await prisma.notification.create({
            data: {
                userId: transferRequest.userId,
                title: 'Transfer Request Rejected',
                message: `Your transfer request has been rejected. Reason: ${rejectionReason}`,
                type: 'warning'
            }
        });

        // Send Email
        try {
            const { emailService } = await import('../services/email.service');
            const user = await prisma.user.findUnique({ where: { id: transferRequest.userId } });
            if (user) {
                await emailService.sendEmail(
                    user.email,
                    'Transfer Request Rejected',
                    `<p>Your transfer request was rejected. Reason: ${rejectionReason}</p>`
                );
            }
        } catch (err) {
            console.error('Failed to send rejection email', err);
        }

        res.status(200).json({
            success: true,
            data: updated,
            message: 'Transfer request rejected'
        });
    } catch (error) {
        next(error);
    }
};
