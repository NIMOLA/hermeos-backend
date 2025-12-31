import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult, body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Create investment (purchase property units)
export const createInvestment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user!.id;
        const { propertyId, units, paymentMethod } = req.body;

        // Fetch property
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        // Check if property is available for investment
        if (property.status !== 'LISTED') {
            return next(new AppError('Property is not available for investment', 400));
        }

        // Check if enough units are available
        if (units > property.availableUnits) {
            return next(new AppError(`Only ${property.availableUnits} units available`, 400));
        }

        const totalCost = Number(property.pricePerUnit) * units;

        // If wallet payment, check balance
        if (paymentMethod === 'wallet') {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user || Number(user.walletBalance) < totalCost) {
                return next(new AppError('Insufficient wallet balance', 400));
            }
        }

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create transaction record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    propertyId,
                    type: 'OWNERSHIP_REGISTRATION',
                    amount: totalCost,
                    status: paymentMethod === 'wallet' ? 'COMPLETED' : 'PENDING',
                    paymentMethod,
                    description: `Purchase of ${units} units of ${property.name}`
                }
            });

            if (paymentMethod === 'wallet') {
                // Deduct from wallet
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        walletBalance: {
                            decrement: totalCost
                        }
                    }
                });

                // Create or update ownership
                const existingOwnership = await tx.ownership.findFirst({
                    where: {
                        userId,
                        propertyId
                    }
                });

                if (existingOwnership) {
                    // Add units to existing ownership
                    await tx.ownership.update({
                        where: { id: existingOwnership.id },
                        data: {
                            units: {
                                increment: units
                            }
                        }
                    });
                } else {
                    // Create new ownership
                    await tx.ownership.create({
                        data: {
                            userId,
                            propertyId,
                            units,
                            acquisitionPrice: totalCost,
                            acquisitionDate: new Date()
                        }
                    });
                }

                // Update property available units
                await tx.property.update({
                    where: { id: propertyId },
                    data: {
                        availableUnits: {
                            decrement: units
                        },
                        status: property.availableUnits - units === 0 ? 'FULLY_SUBSCRIBED' : property.status
                    }
                });

                // Create notification
                await tx.notification.create({
                    data: {
                        userId,
                        title: 'Investment Successful',
                        message: `You have successfully acquired ${units} units of ${property.name}`,
                        type: 'success'
                    }
                });
            }

            return transaction;
        });

        res.status(201).json({
            success: true,
            data: {
                transactionId: result.id,
                status: result.status,
                amount: Number(result.amount),
                units,
                message: paymentMethod === 'wallet'
                    ? 'Investment completed successfully'
                    : 'Payment pending. Please complete payment to finalize your investment.'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get user's investment history
export const getInvestmentHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const investments = await prisma.transaction.findMany({
            where: {
                userId,
                type: 'OWNERSHIP_REGISTRATION'
            },
            include: {
                property: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        images: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedInvestments = investments.map(inv => ({
            id: inv.id,
            property: {
                id: inv.property?.id,
                name: inv.property?.name,
                location: inv.property?.location,
                imageUrl: inv.property?.images?.[0] || ''
            },
            amount: Number(inv.amount),
            status: inv.status.toLowerCase(),
            date: inv.createdAt,
            paymentMethod: inv.paymentMethod
        }));

        res.json(formattedInvestments);
    } catch (error) {
        next(error);
    }
};

// Validation rules
export const createInvestmentValidation = [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('units').isInt({ min: 1 }).withMessage('Units must be a positive integer'),
    body('paymentMethod').isIn(['wallet', 'paystack']).withMessage('Invalid payment method'),
];
