import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get user's ownerships
export const getMyOwnerships = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const ownerships = await prisma.ownership.findMany({
            where: { userId: req.user!.id },
            include: {
                property: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        images: true,
                        pricePerUnit: true,
                        propertyType: true,
                        expectedAnnualIncome: true
                    }
                }
            },
            orderBy: { acquisitionDate: 'desc' }
        });

        // Calculate total investment
        const totalInvestment = ownerships.reduce((sum, o) => sum + Number(o.acquisitionPrice), 0);

        res.status(200).json({
            success: true,
            data: {
                ownerships,
                summary: {
                    totalProperties: ownerships.length,
                    totalInvestment,
                    totalUnits: ownerships.reduce((sum, o) => sum + o.units, 0)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Register new ownership (purchase units)
export const registerOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { propertyId, units, paymentReference } = req.body;
        const user = req.user!;

        // Enforce KYC verification
        if (!user.isVerified && user.role === 'USER') {
            return next(new AppError('KYC verification required to purchase assets', 403));
        }

        // Validate property
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        if (property.status !== 'LISTED') {
            return next(new AppError('Property not available for registration', 400));
        }

        if (property.availableUnits < units) {
            return next(new AppError('Insufficient units available', 400));
        }

        const totalPrice = Number(property.pricePerUnit) * units;

        // Create ownership and transaction in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create ownership
            const ownership = await tx.ownership.create({
                data: {
                    userId: req.user!.id,
                    propertyId,
                    units,
                    acquisitionPrice: totalPrice
                },
                include: { property: true }
            });

            // Update available units
            await tx.property.update({
                where: { id: propertyId },
                data: {
                    availableUnits: { decrement: units }
                }
            });

            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: req.user!.id,
                    propertyId,
                    type: 'OWNERSHIP_REGISTRATION',
                    amount: totalPrice,
                    fee: totalPrice * 0.015, // 1.5% platform fee
                    status: 'COMPLETED',
                    paymentReference,
                    paymentMethod: 'paystack',
                    description: `Registered ${units} units in ${property.name}`
                }
            });

            return ownership;
        });

        res.status(201).json({
            success: true,
            data: result,
            message: 'Ownership registered successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get ownership by ID
export const getOwnershipById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const ownership = await prisma.ownership.findUnique({
            where: { id },
            include: {
                property: true,
                transferRequests: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!ownership) {
            return next(new AppError('Ownership not found', 404));
        }

        // Check authorization
        if (ownership.userId !== req.user!.id && req.user!.role === 'USER') {
            return next(new AppError('Not authorized', 403));
        }

        res.status(200).json({
            success: true,
            data: ownership
        });
    } catch (error) {
        next(error);
    }
};
