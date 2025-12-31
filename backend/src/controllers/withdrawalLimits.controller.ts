import { Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logFinancialEvent, logSecurityEvent } from '../utils/logger';

const prisma = new PrismaClient();

// Withdrawal limits
const DAILY_WITHDRAWAL_LIMIT = 10000000; // ₦10M per day
const SINGLE_TRANSACTION_LIMIT = 5000000; // ₦5M per transaction

/**
 * Check if user has exceeded daily withdrawal limit
 */
const checkDailyWithdrawalLimit = async (userId: string, amount: number): Promise<boolean> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's withdrawals
    const todayWithdrawals = await prisma.transferRequest.findMany({
        where: {
            userId,
            createdAt: {
                gte: today,
                lt: tomorrow
            },
            status: {
                in: ['PENDING', 'PROCESSING', 'COMPLETED']
            }
        }
    });

    // Calculate total withdrawn today
    const totalToday = todayWithdrawals.reduce(
        (sum, request) => sum + Number(request.amount),
        0
    );

    // Check if this new withdrawal would exceed limit
    return (totalToday + amount) <= DAILY_WITHDRAWAL_LIMIT;
};

/**
 * Create exit request with withdrawal limits
 */
export const createExitRequestWithLimits = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { propertyId, units, reason, bankName, accountNumber, accountName } = req.body;
        const userId = req.user!.id;

        // Use transaction for data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Get ownership
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

            // Check single transaction limit
            if (exitAmount > SINGLE_TRANSACTION_LIMIT) {
                logSecurityEvent('Withdrawal limit exceeded - single transaction', {
                    userId,
                    amount: exitAmount,
                    limit: SINGLE_TRANSACTION_LIMIT
                });
                throw new AppError(
                    `Transaction amount (₦${exitAmount.toLocaleString()}) exceeds single transaction limit of ₦${SINGLE_TRANSACTION_LIMIT.toLocaleString()}. Please split into multiple transactions.`,
                    400
                );
            }

            // Check daily limit
            const withinDailyLimit = await checkDailyWithdrawalLimit(userId, exitAmount);
            if (!withinDailyLimit) {
                logSecurityEvent('Withdrawal limit exceeded - daily limit', {
                    userId,
                    amount: exitAmount,
                    limit: DAILY_WITHDRAWAL_LIMIT
                });
                throw new AppError(
                    `This withdrawal would exceed your daily limit of ₦${DAILY_WITHDRAWAL_LIMIT.toLocaleString()}. Please try again tomorrow or contact support for higher limits.`,
                    400
                );
            }

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

            // Create notification
            await tx.notification.create({
                data: {
                    userId,
                    title: 'Exit Request Submitted',
                    message: `Your exit request for ${units} units (₦${exitAmount.toLocaleString()}) has been submitted and is pending review.`,
                    type: 'info'
                }
            });

            return {
                exitRequest,
                exitAmount
            };
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            timeout: 10000
        });

        logFinancialEvent('Exit request created with limits', userId, result.exitAmount, {
            propertyId,
            units,
            exitRequestId: result.exitRequest.id
        });

        res.status(201).json({
            success: true,
            data: result.exitRequest,
            message: `Exit request submitted for ₦${result.exitAmount.toLocaleString()}`
        });
    } catch (error: any) {
        if (error.code === 'P2034') {
            return next(new AppError('Another transaction is in progress. Please try again.', 409));
        }
        next(error);
    }
};

/**
 * Get user's withdrawal limits status
 */
export const getWithdrawalLimits = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get today's withdrawals
        const todayWithdrawals = await prisma.transferRequest.findMany({
            where: {
                userId,
                createdAt: {
                    gte: today,
                    lt: tomorrow
                },
                status: {
                    in: ['PENDING', 'PROCESSING', 'COMPLETED']
                }
            }
        });

        const totalToday = todayWithdrawals.reduce(
            (sum, request) => sum + Number(request.amount),
            0
        );

        const remainingDaily = DAILY_WITHDRAWAL_LIMIT - totalToday;

        res.json({
            success: true,
            data: {
                dailyLimit: DAILY_WITHDRAWAL_LIMIT,
                singleTransactionLimit: SINGLE_TRANSACTION_LIMIT,
                usedToday: totalToday,
                remainingToday: Math.max(0, remainingDaily),
                transactionsToday: todayWithdrawals.length
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin override for limits (requires SUPER_ADMIN role)
 */
export const createExitRequestAdminOverride = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Check if user is SUPER_ADMIN
        if (req.user!.role !== 'SUPER_ADMIN') {
            return next(new AppError('Only super admins can override withdrawal limits', 403));
        }

        const { userId, propertyId, units, reason, bankName, accountNumber, accountName } = req.body;

        // Similar logic as above but without limit checks
        const result = await prisma.$transaction(async (tx) => {
            const ownership = await tx.ownership.findFirst({
                where: { userId, propertyId }
            });

            if (!ownership || ownership.units < units) {
                throw new AppError('Invalid ownership', 400);
            }

            const property = await tx.property.findUnique({
                where: { id: propertyId }
            });

            if (!property) {
                throw new AppError('Property not found', 404);
            }

            const exitAmount = Number(property.pricePerUnit) * units;

            await tx.ownership.update({
                where: { id: ownership.id },
                data: { units: { decrement: units } }
            });

            await tx.property.update({
                where: { id: propertyId },
                data: { availableUnits: { increment: units } }
            });

            const exitRequest = await tx.transferRequest.create({
                data: {
                    userId,
                    propertyId,
                    units,
                    amount: exitAmount,
                    reason: reason || 'Admin override',
                    status: 'PENDING',
                    bankName,
                    accountNumber,
                    accountName
                }
            });

            return { exitRequest, exitAmount };
        });

        logSecurityEvent('Admin withdrawal limit override', {
            adminId: req.user!.id,
            userId,
            amount: result.exitAmount
        });

        res.status(201).json({
            success: true,
            data: result.exitRequest
        });
    } catch (error) {
        next(error);
    }
};
