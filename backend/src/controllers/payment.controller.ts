import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { encrypt, decrypt } from '../utils/encryption';
import { logFinancialEvent, logSecurityEvent } from '../utils/logger';

const prisma = new PrismaClient();

// Company bank details
export const COMPANY_BANK_DETAILS = {
    bankName: 'Premium Trust Bank',
    accountName: 'Hermeos Proptech',
    accountNumber: '0040225641'
};

/**
 * Initialize Paystack card payment
 */
export const initializeCardPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { propertyId, units, amount } = req.body;
        const userId = req.user!.id;

        // Validate property and units
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        if (units > property.availableUnits) {
            return next(new AppError('Insufficient units available', 400));
        }

        const expectedAmount = Number(property.pricePerUnit) * units;
        if (Math.abs(amount - expectedAmount) > 1) {
            return next(new AppError('Amount mismatch', 400));
        }

        // Import Paystack dynamically (will be installed)
        const Paystack = require('paystack-api');
        const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

        const user = await prisma.user.findUnique({ where: { id: userId } });

        const response = await paystack.transaction.initialize({
            email: user!.email,
            amount: Math.round(amount * 100), // Convert to kobo
            metadata: {
                userId,
                propertyId,
                units,
                type: 'property_investment'
            },
            callback_url: `${process.env.CLIENT_URL}/payment/callback`,
            channels: ['card'] // Only card payments
        });

        logFinancialEvent('Payment initialized', userId, amount, {
            propertyId,
            units,
            reference: response.data.reference
        });

        res.json({
            success: true,
            data: {
                authorizationUrl: response.data.authorization_url,
                reference: response.data.reference,
                accessCode: response.data.access_code
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify Paystack payment and create ownership
 */
export const verifyCardPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { reference } = req.params;
        const userId = req.user!.id;

        const Paystack = require('paystack-api');
        const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

        const response = await paystack.transaction.verify(reference);

        if (response.data.status !== 'success') {
            return next(new AppError('Payment verification failed', 400));
        }

        const { metadata } = response.data;
        const amount = response.data.amount / 100; // Convert from kobo

        // Verify user owns this transaction
        if (metadata.userId !== userId) {
            logSecurityEvent('Payment verification mismatch', {
                userId,
                metadataUserId: metadata.userId,
                reference
            });
            return next(new AppError('Unauthorized', 403));
        }

        // Process payment in transaction
        await prisma.$transaction(async (tx) => {
            // Create transaction record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    propertyId: metadata.propertyId,
                    type: 'OWNERSHIP_REGISTRATION',
                    amount,
                    status: 'COMPLETED',
                    paymentMethod: 'card',
                    paymentReference: reference,
                    description: `Card payment for ${metadata.units} units`
                }
            });

            // Check and update property units
            const property = await tx.property.findUniqueOrThrow({
                where: { id: metadata.propertyId }
            });

            if (property.availableUnits < metadata.units) {
                throw new Error('Units no longer available');
            }

            await tx.property.update({
                where: { id: metadata.propertyId },
                data: {
                    availableUnits: { decrement: metadata.units }
                }
            });

            // Create or update ownership
            const existingOwnership = await tx.ownership.findFirst({
                where: {
                    userId,
                    propertyId: metadata.propertyId
                }
            });

            if (existingOwnership) {
                await tx.ownership.update({
                    where: { id: existingOwnership.id },
                    data: {
                        units: { increment: metadata.units }
                    }
                });
            } else {
                await tx.ownership.create({
                    data: {
                        userId,
                        propertyId: metadata.propertyId,
                        units: metadata.units,
                        acquisitionPrice: amount,
                        acquisitionDate: new Date()
                    }
                });
            }

            // Create notification
            await tx.notification.create({
                data: {
                    userId,
                    title: 'Investment Successful',
                    message: `You have successfully acquired ${metadata.units} units of ${property.name}`,
                    type: 'success'
                }
            });
        });

        logFinancialEvent('Payment completed', userId, amount, {
            propertyId: metadata.propertyId,
            units: metadata.units,
            reference
        });

        res.json({
            success: true,
            message: 'Payment verified and ownership created',
            data: {
                amount,
                units: metadata.units,
                propertyId: metadata.propertyId
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Submit bank transfer proof
 */
export const submitBankTransferProof = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { propertyId, units, amount, depositorName, transferDate, transferReference } = req.body;
        const userId = req.user!.id;

        // Validate property
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        const expectedAmount = Number(property.pricePerUnit) * units;
        if (Math.abs(amount - expectedAmount) > 1) {
            return next(new AppError('Amount mismatch', 400));
        }

        // Create payment proof record
        const proof = await prisma.paymentProof.create({
            data: {
                userId,
                propertyId,
                units,
                amount,
                paymentMethod: 'bank_transfer',
                depositorName,
                transferDate: new Date(transferDate),
                transferReference: transferReference || null,
                status: 'pending'
            }
        });

        // Notify admins
        const admins = await prisma.user.findMany({
            where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
        });

        for (const admin of admins) {
            await prisma.notification.create({
                data: {
                    userId: admin.id,
                    title: 'New Bank Transfer Proof',
                    message: `User has submitted bank transfer proof for ₦${amount.toLocaleString()}`,
                    type: 'warning'
                }
            });
        }

        logFinancialEvent('Bank transfer proof submitted', userId, amount, {
            propertyId,
            units,
            proofId: proof.id
        });

        res.status(201).json({
            success: true,
            message: 'Transfer proof submitted. Awaiting admin verification.',
            data: {
                proofId: proof.id,
                status: 'pending'
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's payment proofs
 */
export const getMyPaymentProofs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const proofs = await prisma.paymentProof.findMany({
            where: { userId },
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

        res.json(proofs.map(p => ({
            id: p.id,
            property: p.property,
            units: p.units,
            amount: Number(p.amount),
            depositorName: p.depositorName,
            transferDate: p.transferDate,
            transferReference: p.transferReference,
            status: p.status,
            verifiedAt: p.verifiedAt,
            rejectionReason: p.rejectionReason,
            createdAt: p.createdAt
        })));
    } catch (error) {
        next(error);
    }
};

/**
 * Get company bank details
 */
export const getBankDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        res.json({
            success: true,
            data: COMPANY_BANK_DETAILS
        });
    } catch (error) {
        next(error);
    }
};
