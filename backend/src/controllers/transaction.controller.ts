import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get all transactions for current user
export const getMyTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { type, status, page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = { userId: req.user!.id };
        if (type) where.type = type;
        if (status) where.status = status;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    property: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.transaction.count({ where })
        ]);

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

// Pay for Asset (Create Transaction)
export const payForAsset = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { propertyId, amount, units, method, reference } = req.body;

        if (!propertyId || !amount || !units) {
            return res.status(400).json({ success: false, message: 'Property ID, units, and amount are required' });
        }

        // Verify Property Exists
        const property = await prisma.property.findUnique({ where: { id: propertyId } });
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Validate Amount
        // Use pricePerUnit or price (fallback)
        const price = Number(property.pricePerUnit || property.totalValue || 0); // Assuming totalValue might be used if single unit, but safely defaulting to pricePerUnit
        // Note: Schema has pricePerUnit. If mock data used 'price', we might have issues. Assuming pricePerUnit is correct field per schema.

        const expectedAmount = price * Number(units);

        // Allow small difference (e.g. fees) but warn if significantly different
        if (expectedAmount > 0 && Math.abs(Number(amount) - expectedAmount) > 1000) {
            return res.status(400).json({ success: false, message: 'Amount mismatch with property price' });
        }

        // Create Transaction Record
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                propertyId,
                type: 'OWNERSHIP_REGISTRATION',
                amount: Number(amount),
                status: 'PENDING',
                reference: reference || `REF-${Date.now()}`,
                description: `Payment for ${units} unit(s) of ${property.name} via ${method || 'Online'}`,
                paymentMethod: method || 'Online'
            }
        });

        // Notify Admins (Optional placeholder)

        res.status(201).json({
            success: true,
            data: transaction,
            message: 'Payment initiated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get transaction details
export const getTransactionById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: {
                property: true
            }
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        if (transaction.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};
