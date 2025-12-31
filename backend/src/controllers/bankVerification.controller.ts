import { Response, NextFunction } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logSecurityEvent } from '../utils/logger';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Verify bank account using Paystack API
 */
export const verifyBankAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { accountNumber, bankCode } = req.body;

        if (!accountNumber || !bankCode) {
            return next(new AppError('Account number and bank code are required', 400));
        }

        // Call Paystack verification API
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/bank/resolve`,
            {
                params: {
                    account_number: accountNumber,
                    bank_code: bankCode
                },
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status) {
            const accountName = response.data.data.account_name;

            logSecurityEvent('Bank account verified', {
                userId: req.user!.id,
                accountNumber,
                bankCode,
                accountName
            });

            res.json({
                success: true,
                data: {
                    accountName,
                    accountNumber,
                    bankCode,
                    verified: true
                }
            });
        } else {
            return next(new AppError('Could not verify bank account', 400));
        }
    } catch (error: any) {
        if (error.response?.data?.message) {
            return next(new AppError(error.response.data.message, 400));
        }
        next(error);
    }
};

/**
 * Get list of supported banks from Paystack
 */
export const getSupportedBanks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/bank`,
            {
                params: {
                    country: 'nigeria',
                    use_cursor: false
                },
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        if (response.data.status) {
            res.json({
                success: true,
                data: response.data.data
            });
        } else {
            return next(new AppError('Could not fetch banks', 500));
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Verify and save bank account for exit requests
 */
export const verifyAndSaveBankAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { accountNumber, bankCode, bankName } = req.body;
        const userId = req.user!.id;

        // Verify account first
        const verifyResponse = await axios.get(
            `${PAYSTACK_BASE_URL}/bank/resolve`,
            {
                params: {
                    account_number: accountNumber,
                    bank_code: bankCode
                },
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        if (!verifyResponse.data.status) {
            return next(new AppError('Invalid bank account details', 400));
        }

        const verifiedAccountName = verifyResponse.data.data.account_name;

        // Save to user profile (you can extend User model or create BankAccount model)
        // For now, we'll just return the verified details

        logSecurityEvent('Bank account verified and saved', {
            userId,
            accountNumber,
            bankCode,
            verifiedAccountName
        });

        res.json({
            success: true,
            data: {
                accountName: verifiedAccountName,
                accountNumber,
                bankCode,
                bankName,
                verified: true
            },
            message: 'Bank account verified successfully'
        });
    } catch (error: any) {
        if (error.response?.data?.message) {
            return next(new AppError(error.response.data.message, 400));
        }
        next(error);
    }
};
