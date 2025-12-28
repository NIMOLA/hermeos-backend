import { Response, NextFunction } from 'express';
import { PrismaClient, TransferStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Create transfer request
export const createTransferRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { ownershipId, units, requestedPrice, reason, bankName, accountNumber } = req.body;

        // Verify ownership
        const ownership = await prisma.ownership.findUnique({
            where: { id: ownershipId },
            include: { property: true }
        });

        if (!ownership) {
            return next(new AppError('Ownership not found', 404));
        }

        if (ownership.userId !== req.user!.id) {
            return next(new AppError('Not authorized', 403));
        }

        if (ownership.units < units) {
            return next(new AppError('Insufficient units', 400));
        }

        const transferRequest = await prisma.transferRequest.create({
            data: {
                userId: req.user!.id,
                ownershipId,
                units,
                requestedPrice,
                reason,
                bankName,
                accountNumber,
                status: 'PENDING'
            },
            include: {
                ownership: {
                    include: { property: true }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: transferRequest,
            message: 'Transfer request submitted successfully'
        });
    } catch (error) {
        next(error);
    }
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

        const updated = await prisma.transferRequest.update({
            where: { id },
            data: {
                status: 'APPROVED',
                reviewedBy: req.user!.id,
                reviewedAt: new Date()
            }
        });

        // Create notification
        await prisma.notification.create({
            data: {
                userId: transferRequest.userId,
                title: 'Transfer Request Approved',
                message: `Your transfer request for ${transferRequest.units} units has been approved and is being processed.`,
                type: 'success'
            }
        });

        res.status(200).json({
            success: true,
            data: updated,
            message: 'Transfer request approved'
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

        res.status(200).json({
            success: true,
            data: updated,
            message: 'Transfer request rejected'
        });
    } catch (error) {
        next(error);
    }
};
