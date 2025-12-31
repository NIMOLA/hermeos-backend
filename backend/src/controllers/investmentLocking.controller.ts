import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logFinancialEvent } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Create investment with transaction locking to prevent race conditions
 */
export const createInvestmentWithLocking = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { propertyId, units, paymentMethod } = req.body;
        const userId = req.user!.id;

        // Use Prisma transaction with serializable isolation level
        const result = await prisma.$transaction(async (tx) => {
            // Lock the property row and get latest data
            const property = await tx.property.findUnique({
                where: { id: propertyId }
            });

            if (!property) {
                throw new AppError('Property not found', 404);
            }

            // Check if enough units available
            if (property.availableUnits < units) {
                throw new AppError(
                    `Insufficient units available. Only ${property.availableUnits} units remaining.`,
                    400
                );
            }

            // Calculate total amount
            const totalAmount = Number(property.pricePerUnit) * units;

            // Deduct units from property (this locks the row)
            await tx.property.update({
                where: { id: propertyId },
                data: {
                    availableUnits: {
                        decrement: units
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

            let ownership;
            if (existingOwnership) {
                ownership = await tx.ownership.update({
                    where: { id: existingOwnership.id },
                    data: {
                        units: {
                            increment: units
                        }
                    }
                });
            } else {
                ownership = await tx.ownership.create({
                    data: {
                        userId,
                        propertyId,
                        units,
                        acquisitionPrice: totalAmount,
                        acquisitionDate: new Date()
                    }
                });
            }

            // Create transaction record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    propertyId,
                    type: 'OWNERSHIP_REGISTRATION',
                    amount: totalAmount,
                    status: 'PENDING',
                    paymentMethod,
                    description: `Investment of ${units} units via ${paymentMethod}`
                }
            });

            return {
                ownership,
                transaction,
                totalAmount
            };
        }, {
            isolationLevel: 'Serializable', // Prevents phantom reads and race conditions
            timeout: 10000 // 10 second timeout
        });

        logFinancialEvent('Investment created with locking', userId, result.totalAmount, {
            propertyId,
            units,
            transactionId: result.transaction.id
        });

        res.status(201).json({
            success: true,
            data: {
                ownership: result.ownership,
                transaction: result.transaction,
                totalAmount: result.totalAmount
            }
        });
    } catch (error: any) {
        // Handle transaction conflicts
        if (error.code === 'P2034') {
            return next(new AppError('Another transaction is in progress. Please try again.', 409));
        }
        next(error);
    }
};

/**
 * Process exit request with transaction locking
 */
export const createExitRequestWithLocking = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { propertyId, units, reason, bankName, accountNumber, accountName } = req.body;
        const userId = req.user!.id;

        const result = await prisma.$transaction(async (tx) => {
            // Lock ownership record
            const ownership = await tx.ownership.findFirst({
                where: {
                    userId,
                    propertyId
                }
            });

            if (!ownership) {
                throw new AppError('You do not own units in this property', 404);
            }

            if (ownership.units < units) {
                throw new AppError(`Insufficient units. You only own ${ownership.units} units.`, 400);
            }

            // Get property details
            const property = await tx.property.findUnique({
                where: { id: propertyId }
            });

            if (!property) {
                throw new AppError('Property not found', 404);
            }

            // Calculate exit amount
            const exitAmount = Number(property.pricePerUnit) * units;

            // Deduct units from ownership
            await tx.ownership.update({
                where: { id: ownership.id },
                data: {
                    units: {
                        decrement: units
                    }
                }
            });

            // Add units back to property
            await tx.property.update({
                where: { id: propertyId },
                data: {
                    availableUnits: {
                        increment: units
                    }
                }
            });

            // Create exit request
            const exitRequest = await tx.transferRequest.create({
                data: {
                    userId,
                    propertyId,
                    units,
                    amount: exitAmount,
                    reason: reason || '',
                    status: 'PENDING',
                    bankName,
                    accountNumber,
                    accountName
                }
            });

            return {
                exitRequest,
                exitAmount
            };
        }, {
            isolationLevel: 'Serializable',
            timeout: 10000
        });

        logFinancialEvent('Exit request created with locking', userId, result.exitAmount, {
            propertyId,
            units,
            exitRequestId: result.exitRequest.id
        });

        res.status(201).json({
            success: true,
            data: result.exitRequest
        });
    } catch (error: any) {
        if (error.code === 'P2034') {
            return next(new AppError('Another transaction is in progress. Please try again.', 409));
        }
        next(error);
    }
};
