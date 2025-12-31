import { Response, NextFunction } from 'express';
import { PrismaClient, TransferStatus } from '@prisma/client';
import { validationResult, body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get user's exit requests
export const getMyExitRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const requests = await prisma.transferRequest.findMany({
            where: { userId },
            include: {
                ownership: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                name: true,
                                location: true,
                                images: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedRequests = requests.map(req => ({
            id: req.id,
            property: {
                id: req.ownership.property.id,
                name: req.ownership.property.name,
                location: req.ownership.property.location,
                imageUrl: req.ownership.property.images[0] || ''
            },
            units: req.units,
            requestedPrice: req.requestedPrice ? Number(req.requestedPrice) : null,
            status: req.status.toLowerCase(),
            reason: req.reason,
            bankDetails: {
                bankName: req.bankName,
                accountNumber: req.accountNumber
            },
            createdAt: req.createdAt,
            reviewedAt: req.reviewedAt,
            rejectionReason: req.rejectionReason
        }));

        res.json(formattedRequests);
    } catch (error) {
        next(error);
    }
};

// Get single exit request details
export const getExitRequestById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const request = await prisma.transferRequest.findFirst({
            where: {
                id,
                userId
            },
            include: {
                ownership: {
                    include: {
                        property: true
                    }
                }
            }
        });

        if (!request) {
            return next(new AppError('Exit request not found', 404));
        }

        res.json({
            id: request.id,
            property: request.ownership.property,
            ownership: {
                units: request.ownership.units,
                acquisitionPrice: Number(request.ownership.acquisitionPrice),
                acquisitionDate: request.ownership.acquisitionDate
            },
            requestedUnits: request.units,
            requestedPrice: request.requestedPrice ? Number(request.requestedPrice) : null,
            status: request.status,
            reason: request.reason,
            bankDetails: {
                bankName: request.bankName,
                accountNumber: request.accountNumber
            },
            createdAt: request.createdAt,
            reviewedAt: request.reviewedAt,
            reviewedBy: request.reviewedBy,
            rejectionReason: request.rejectionReason
        });
    } catch (error) {
        next(error);
    }
};

// Create exit request
export const createExitRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user!.id;
        const { ownershipId, units, reason, bankName, accountNumber, accountName } = req.body;

        // Verify ownership exists and belongs to user
        const ownership = await prisma.ownership.findFirst({
            where: {
                id: ownershipId,
                userId
            },
            include: {
                property: true
            }
        });

        if (!ownership) {
            return next(new AppError('Ownership not found', 404));
        }

        // Validate units
        if (units > ownership.units) {
            return next(new AppError('Cannot request more units than you own', 400));
        }

        if (units <= 0) {
            return next(new AppError('Units must be greater than 0', 400));
        }

        // Check for pending requests for this ownership
        const pendingRequest = await prisma.transferRequest.findFirst({
            where: {
                ownershipId,
                status: 'PENDING'
            }
        });

        if (pendingRequest) {
            return next(new AppError('You already have a pending exit request for this property', 400));
        }

        // Calculate estimated payout (current value * units percentage)
        const unitsPercentage = units / ownership.units;
        const ownershipCurrentValue = (ownership as any).currentValue as any; // Type assertion for new field
        const currentValue = ownershipCurrentValue || ownership.acquisitionPrice;
        const estimatedPayout = Number(currentValue) * unitsPercentage;

        // Create exit request
        const exitRequest = await prisma.transferRequest.create({
            data: {
                userId,
                ownershipId,
                units,
                requestedPrice: estimatedPayout,
                reason: reason || 'Liquidity needs',
                bankName,
                accountNumber,
                status: 'PENDING'
            },
            include: {
                ownership: {
                    include: {
                        property: {
                            select: {
                                name: true,
                                location: true
                            }
                        }
                    }
                }
            }
        });

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId,
                title: 'Exit Request Submitted',
                message: `Your exit request for ${units} units of ${exitRequest.ownership.property.name} has been submitted and is pending review.`,
                type: 'info'
            }
        });

        // Create notification for admins
        const admins = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] }
            }
        });

        for (const admin of admins) {
            await prisma.notification.create({
                data: {
                    userId: admin.id,
                    title: 'New Exit Request',
                    message: `User has requested to exit ${units} units of ${exitRequest.ownership.property.name}`,
                    type: 'warning'
                }
            });
        }

        res.status(201).json({
            success: true,
            data: {
                id: exitRequest.id,
                status: exitRequest.status,
                estimatedPayout,
                message: 'Exit request submitted successfully. You will be notified once it is reviewed.'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Cancel exit request (only if pending)
export const cancelExitRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const request = await prisma.transferRequest.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!request) {
            return next(new AppError('Exit request not found', 404));
        }

        if (request.status !== 'PENDING') {
            return next(new AppError('Can only cancel pending requests', 400));
        }

        await prisma.transferRequest.update({
            where: { id },
            data: {
                status: 'CANCELLED'
            }
        });

        res.json({
            success: true,
            message: 'Exit request cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Validation rules
export const createExitRequestValidation = [
    body('ownershipId').notEmpty().withMessage('Ownership ID is required'),
    body('units').isInt({ min: 1 }).withMessage('Units must be a positive integer'),
    body('bankName').notEmpty().withMessage('Bank name is required'),
    body('accountNumber').notEmpty().matches(/^\d{10}$/).withMessage('Account number must be 10 digits'),
    body('accountName').optional(),
    body('reason').optional()
];
