import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from './errorHandler';

const prisma = new PrismaClient();

// Get proceeds/dividends summary
export const getProceeds = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        // Get all distribution transactions for user
        const distributions = await prisma.transaction.findMany({
            where: {
                userId,
                type: 'DISTRIBUTION',
                status: 'COMPLETED'
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

        // Calculate summary
        const totalEarnings = distributions.reduce((sum, d) => sum + Number(d.amount), 0);

        // YTD earnings
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        const ytdEarnings = distributions
            .filter(d => new Date(d.createdAt) >= yearStart)
            .reduce((sum, d) => sum + Number(d.amount), 0);

        // Next payout (mock for now - would come from scheduled distributions)
        const nextPayout = {
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            estimatedAmount: totalEarnings > 0 ? totalEarnings / distributions.length : 0
        };

        // Format history
        const history = distributions.map(d => ({
            id: d.id,
            propertyName: d.property?.name || 'Unknown Property',
            propertyLocation: d.property?.location,
            amount: Number(d.amount),
            date: d.createdAt,
            period: new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            status: d.status.toLowerCase(),
            paymentReference: d.paymentReference
        }));

        res.json({
            summary: {
                ytdEarnings,
                totalEarnings,
                totalPayouts: distributions.length,
                nextPayout
            },
            history
        });
    } catch (error) {
        next(error);
    }
};

// Get user's complete transaction history
export const getTransactionHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { type, status, dateFrom, dateTo, search, page = 1, limit = 20 } = req.query;

        // Build filter
        const where: any = { userId };

        if (type && type !== 'all') {
            where.type = String(type).toUpperCase();
        }

        if (status) {
            where.status = String(status).toUpperCase();
        }

        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) where.createdAt.gte = new Date(String(dateFrom));
            if (dateTo) where.createdAt.lte = new Date(String(dateTo));
        }

        if (search) {
            where.OR = [
                { description: { contains: String(search), mode: 'insensitive' } },
                { paymentReference: { contains: String(search), mode: 'insensitive' } }
            ];
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Fetch transactions
        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                include: {
                    property: {
                        select: {
                            id: true,
                            name: true,
                            location: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: limitNum,
                skip
            }),
            prisma.transaction.count({ where })
        ]);

        const formattedTransactions = transactions.map(t => ({
            id: t.id,
            type: t.type.toLowerCase().replace('_', ' '),
            description: t.description || getDefaultDescription(t.type),
            amount: Number(t.amount),
            fee: Number(t.fee),
            status: t.status.toLowerCase(),
            date: t.createdAt,
            property: t.property ? {
                id: t.property.id,
                name: t.property.name,
                location: t.property.location
            } : null,
            paymentMethod: t.paymentMethod,
            paymentReference: t.paymentReference
        }));

        res.json({
            transactions: formattedTransactions,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        next(error);
    }
};

function getDefaultDescription(type: string): string {
    const descriptions: Record<string, string> = {
        OWNERSHIP_REGISTRATION: 'Property Investment',
        DISTRIBUTION: 'Dividend Payment',
        TRANSFER_REQUEST: 'Exit Request',
        WALLET_DEPOSIT: 'Wallet Deposit',
        WALLET_WITHDRAWAL: 'Wallet Withdrawal'
    };
    return descriptions[type] || 'Transaction';
}
