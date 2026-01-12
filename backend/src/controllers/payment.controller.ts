
import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logFinancialEvent, logSecurityEvent } from '../utils/logger';
import { PaymentService } from '../services/payment.service';

const prisma = new PrismaClient();
const paymentService = new PaymentService();

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

        // Enforce KYC verification
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return next(new AppError('User not found', 404));

        if (!user.isVerified && user.role === 'USER') {
            return next(new AppError('KYC verification required to invest', 403));
        }

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

        const response = await paymentService.initializePayment(
            user.email,
            amount.toString(),
            {
                userId,
                propertyId,
                units,
                type: 'property_investment'
            }
        );

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

        // 1. Verify Payment with Gateway
        const verifiedData = await paymentService.verifyPayment(reference);
        const { metadata } = verifiedData;
        const amount = verifiedData.amount / 100; // Convert from kobo

        // 2. Security Check: Verify user owns this transaction
        if (metadata.userId !== userId) {
            logSecurityEvent('Payment verification mismatch', {
                userId,
                metadataUserId: metadata.userId,
                reference
            });
            return next(new AppError('Unauthorized transaction ownership', 403));
        }

        // 3. Process Investment Logic (Service does atomic DB transaction)
        const result = await paymentService.processInvestmentCompletion(
            userId,
            metadata.propertyId,
            metadata.units,
            amount,
            reference,
            verifiedData
        );

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
                propertyId: metadata.propertyId,
                ownershipId: result.ownership.id
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

        // Enforce KYC verification
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user.isVerified && user.role === 'USER') {
            return next(new AppError('KYC verification required to invest', 403));
        }

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
