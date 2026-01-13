import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

const paymentService = new PaymentService();

export const getBanks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const banks = await paymentService.getBanks();
        res.status(200).json({
            success: true,
            data: banks
        });
    } catch (error) {
        next(error);
    }
};

export const verifyAndAddBankAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountNumber, bankCode, bankName } = req.body;
        // userId from auth middleware
        const userId = (req as any).user.id;

        if (!accountNumber || !bankCode) {
            return next(new AppError('Account number and bank code are required', 400));
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return next(new AppError('User not found', 404));

        // 1. Resolve Account
        const resolveData = await paymentService.resolveAccountNumber(accountNumber, bankCode);
        const resolvedName = resolveData.account_name; // e.g., "DOE JOHN"

        // 2. Name Matching Logic
        const userFullName = `${user.lastName} ${user.firstName}`.toLowerCase(); // Standard Nigerian bank format often puts Surname first
        const resolvedLower = resolvedName.toLowerCase();

        // Basic Check: Does resolved name contain parts of user name?
        // Robust check: Split and check intersection
        const userParts = userFullName.split(' ').filter(p => p.length > 2);
        const resolvedParts = resolvedLower.split(' ').filter(p => p.length > 2);

        const matchCount = userParts.filter(part => resolvedParts.some(rp => rp.includes(part) || part.includes(rp))).length;

        // Requires at least 2 matching name parts (First + Last)
        // Adjust strictness as needed.
        if (matchCount < 2) {
            return next(new AppError(`Name Mismatch. Account Name (${resolvedName}) does not match your profile name.`, 400));
        }

        // 3. Save to DB
        // Check if exists
        const existing = await prisma.bankAccount.findFirst({
            where: { userId, accountNumber, bankCode }
        });

        let bankAccount;
        if (existing) {
            bankAccount = await prisma.bankAccount.update({
                where: { id: existing.id },
                data: { isVerified: true, accountName: resolvedName }
            });
        } else {
            bankAccount = await prisma.bankAccount.create({
                data: {
                    userId,
                    bankName: bankName || 'Unknown Bank',
                    bankCode,
                    accountNumber,
                    accountName: resolvedName,
                    isVerified: true
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                message: 'Bank account verified successfully',
                accountName: resolvedName,
                bankAccount
            }
        });

    } catch (error) {
        next(error);
    }
};
