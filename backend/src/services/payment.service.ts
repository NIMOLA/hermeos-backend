
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Import safely for compilation, but we might still need require if it's not typed well
// But preferably we use import if possible. If 'paystack-api' is a CJS module, default import works.
// We will move the require to top level but check if it breaks compilation.
const Paystack = require('paystack-api');

export class PaymentService {
    private paystack: any;

    constructor() {
        if (process.env.PAYSTACK_SECRET_KEY) {
            this.paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
        } else {
            console.warn('PAYSTACK_SECRET_KEY is not set. Payments will fail.');
        }
    }

    /**
     * Initialize a card payment
     */
    async initializePayment(email: string, amount: string, metadata: any) {
        if (!this.paystack) throw new AppError('Payment gateway not configured', 500);

        // Amount in Kobo
        const koboAmount = parseFloat(amount) * 100;

        try {
            const response = await this.paystack.transaction.initialize({
                email,
                amount: Math.round(koboAmount),
                metadata,
                channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
                callback_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/callback`
            });
            return response;
        } catch (error: any) {
            throw new AppError(`Payment initialization failed: ${error.message}`, 502);
        }
    }

    /**
     * Verify a payment reference
     */
    async verifyPayment(reference: string) {
        if (!this.paystack) throw new AppError('Payment gateway not configured', 500);

        try {
            const response = await this.paystack.transaction.verify({ reference });

            if (response.data.status !== 'success') {
                throw new AppError(`Payment failed with status: ${response.data.status}`, 400);
            }

            return response.data;
        } catch (error: any) {
            // Pass through AppError, wrap others
            if (error instanceof AppError) throw error;
            throw new AppError(`Payment verification failed: ${error.message}`, 502);
        }
    }

    /**
     * Process successful investment payment
     * Uses Prisma Transaction for atomicity
     */
    async processInvestmentCompletion(userId: string, propertyId: string, units: number, amount: number, reference: string, verifiedData: any) {
        // Idempotency check
        const existingTx = await prisma.transaction.findUnique({
            where: { reference }
        });
        if (existingTx) {
            const ownership = await prisma.ownership.findUnique({ where: { id: existingTx.ownershipId } });
            // return consistently
            return { transaction: existingTx, ownership };
        }

        return await prisma.$transaction(async (tx) => {
            // 1. Verify property availability again (critical race condition check)
            const property = await tx.property.findUnique({ where: { id: propertyId } });
            if (!property) throw new AppError('Property not found', 404);
            if (property.availableUnits < units) throw new AppError('Units no longer available', 400);

            // 2. Create Ownership
            const ownership = await tx.ownership.create({
                data: {
                    userId,
                    propertyId,
                    units,
                    acquisitionPrice: amount,
                    // acquisitionDate defaults to now
                }
            });

            // 3. Decrement Units
            await tx.property.update({
                where: { id: propertyId },
                data: { availableUnits: { decrement: units } }
            });

            // 4. Create Transaction
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    propertyId,
                    ownershipId: ownership.id,
                    type: 'OWNERSHIP_REGISTRATION',
                    amount,
                    fee: 0, // Calculate fee if needed
                    status: 'COMPLETED',
                    reference,
                    paymentReference: verifiedData.reference, // Paystack ref
                    paymentMethod: verifiedData.channel,
                    description: `Investment in ${units} units of ${property.name}`
                }
            });

            // 5. Notify (optional logic here or in controller)

            return { ownership, transaction };
        });
    }

    /**
     * Get list of banks
     */
    /**
     * Get list of banks
     */
    async getBanks() {
        // Fallback list of major Nigerian banks
        const fallbackBanks = [
            { name: 'Access Bank', code: '044', slug: 'access-bank', id: 1 },
            { name: 'Guaranty Trust Bank', code: '058', slug: 'guaranty-trust-bank', id: 2 },
            { name: 'Zenith Bank', code: '057', slug: 'zenith-bank', id: 3 },
            { name: 'First Bank of Nigeria', code: '011', slug: 'first-bank-of-nigeria', id: 4 },
            { name: 'United Bank For Africa', code: '033', slug: 'united-bank-for-africa', id: 5 },
            { name: 'Fidelity Bank', code: '070', slug: 'fidelity-bank', id: 6 },
            { name: 'Stanbic IBTC Bank', code: '221', slug: 'stanbic-ibtc-bank', id: 7 },
            { name: 'Kuda Bank', code: '50211', slug: 'kuda-bank', id: 8 },
            { name: 'Opay', code: '999992', slug: 'opay', id: 9 },
            { name: 'PalmPay', code: '999991', slug: 'palmpay', id: 10 }
        ];

        try {
            if (this.paystack) {
                const response = await this.paystack.misc.list_banks({ country: 'nigeria' });
                if (response.status && response.data && response.data.length > 0) {
                    return response.data;
                }
            }
            console.warn('Paystack unconfigured or returned empty list. Using fallback banks.');
            return fallbackBanks;
        } catch (error: any) {
            console.error(`Failed to fetch banks from Paystack: ${error.message}. Using fallback.`);
            return fallbackBanks;
        }
    }

    /**
     * Resolve Account Number
     */
    async resolveAccountNumber(accountNumber: string, bankCode: string) {
        if (!this.paystack) throw new AppError('Payment gateway not configured', 500);
        try {
            const response = await this.paystack.verification.resolveAccount({
                account_number: accountNumber,
                bank_code: bankCode
            });

            if (!response.status || !response.data) {
                throw new AppError('Could not resolve account details', 400);
            }

            return response.data; // verified account name
        } catch (error: any) {
            throw new AppError(`Account verification failed: ${error.message}`, 400);
        }
    }
}
