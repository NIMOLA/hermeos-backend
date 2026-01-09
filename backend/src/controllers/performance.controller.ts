import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get property performance data
export const getPortfolioPerformance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { period = 'ytd' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate: Date;
        switch (period) {
            case '12m': startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1); break;
            case 'q3': startDate = new Date(now.getFullYear(), 6, 1); break;
            case 'ytd': default: startDate = new Date(now.getFullYear(), 0, 1);
        }

        // Get all user transactions
        const transactions = await prisma.transaction.findMany({
            where: { userId, createdAt: { gte: startDate } },
            orderBy: { createdAt: 'desc' }
        });

        // Get all user distributions (via transactions or distribution table joined with ownership)
        // Simpler: Fetch all ownerships to get property details
        const ownerships = await prisma.ownership.findMany({
            where: { userId },
            include: { property: true }
        });

        const propertyIds = ownerships.map(o => o.propertyId);

        // Get Distributions matching these properties
        // detailed logic can be improved, but using transactions is safer for "User Received" cash
        const userDistributions = transactions
            .filter(t => t.type === 'DISTRIBUTION' && t.status === 'COMPLETED')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        // KPI Calculations
        const totalIncome = userDistributions; // For user, total income is requests
        const netDistributions = userDistributions;
        const occupancyRate = 95; // Mock average

        // Next Payout (Find earliest upcoming distribution across all properties)
        const upcomingDistributions = await prisma.distribution.findMany({
            where: {
                propertyId: { in: propertyIds },
                distributionDate: { gt: now }
            },
            orderBy: { distributionDate: 'asc' },
            take: 1
        });

        const nextPayout = upcomingDistributions[0] || null;

        // Allocations (Mock/Average)
        const allocations = { partnerDistribution: 70, maintenanceOps: 20, proptechFees: 10 };

        // Generate monthly data
        const monthlyData = generateMonthlyData(startDate, now, transactions, null);

        res.json({
            property: { id: 'all', name: 'All Properties', location: 'Global' },
            kpis: {
                totalIncome,
                netDistributions,
                occupancyRate,
                nextPayout: nextPayout ? {
                    date: nextPayout.distributionDate,
                    estimatedAmount: Number(nextPayout.amount) // This is total prop distribution, inaccurate but placeholder
                } : null
            },
            incomeTrends: monthlyData,
            allocations,
            transactions: transactions.slice(0, 50).map(t => ({
                id: t.id,
                date: t.createdAt,
                description: t.description || getTransactionDescription(t.type),
                category: t.type,
                status: t.status,
                amount: Number(t.amount)
            }))
        });

    } catch (error) {
        next(error);
    }
};

export const getPropertyPerformance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { propertyId } = req.params;
        const { period = 'ytd' } = req.query; // ytd, 12m, q3, etc.

        // Verify user owns this property
        const ownership = await prisma.ownership.findFirst({
            where: {
                userId,
                propertyId
            }
        });

        if (!ownership) {
            return next(new AppError('Property not found in your portfolio', 404));
        }

        // Get property details
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        // Calculate date range based on period
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case '12m':
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
                break;
            case 'q3':
                startDate = new Date(now.getFullYear(), 6, 1); // Q3 starts July
                break;
            case 'ytd':
            default:
                startDate = new Date(now.getFullYear(), 0, 1);
        }

        // Get transactions for this property
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                propertyId,
                createdAt: {
                    gte: startDate
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Get distributions
        const distributions = await prisma.distribution.findMany({
            where: {
                propertyId,
                distributionDate: {
                    gte: startDate
                }
            },
            orderBy: { distributionDate: 'asc' }
        });

        // Calculate monthly income trends
        const monthlyData = generateMonthlyData(startDate, now, transactions, property);

        // Calculate KPIs
        const totalIncome = distributions.reduce((sum, d) => sum + Number(d.amount), 0);
        const userDistributions = transactions
            .filter(t => t.type === 'DISTRIBUTION' && t.status === 'COMPLETED')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const occupancyRate = 94; // Mock - calculate from property data
        const nextPayout = distributions.find(d => new Date(d.distributionDate) > now);

        // Revenue allocation (simplified)
        const allocations = {
            partnerDistribution: 65,
            maintenanceOps: 20,
            proptechFees: 15
        };

        res.json({
            property: {
                id: property.id,
                name: property.name,
                location: property.location
            },
            kpis: {
                totalIncome,
                netDistributions: userDistributions,
                occupancyRate,
                nextPayout: nextPayout ? {
                    date: nextPayout.distributionDate,
                    estimatedAmount: Number(nextPayout.amount) * (ownership.units / property.totalUnits)
                } : null
            },
            incomeTrends: monthlyData,
            allocations,
            transactions: transactions.slice(0, 10).map(t => ({
                id: t.id,
                date: t.createdAt,
                description: t.description || getTransactionDescription(t.type),
                category: t.type,
                status: t.status,
                amount: Number(t.amount)
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Get income performance over time (for area chart)
export const getIncomePerformance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { months = 12 } = req.query;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - Number(months));

        // Get all user's ownerships
        const ownerships = await prisma.ownership.findMany({
            where: { userId },
            include: { property: true }
        });

        // Get all distributions for user's properties
        const propertyIds = ownerships.map(o => o.propertyId);
        const distributions = await prisma.distribution.findMany({
            where: {
                propertyId: { in: propertyIds },
                distributionDate: { gte: startDate }
            },
            include: { property: true }
        });

        // Group by month
        const monthlyIncome: Record<string, number> = {};

        distributions.forEach(dist => {
            const month = new Date(dist.distributionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const ownership = ownerships.find(o => o.propertyId === dist.propertyId);
            if (ownership) {
                const userShare = (ownership.units / dist.property.totalUnits) * Number(dist.amount);
                monthlyIncome[month] = (monthlyIncome[month] || 0) + userShare;
            }
        });

        const data = Object.entries(monthlyIncome).map(([month, income]) => ({
            month,
            income: Math.round(income),
            cumulativeIncome: 0 // Calculate cumulative
        }));

        // Calculate cumulative
        let cumulative = 0;
        data.forEach(d => {
            cumulative += d.income;
            d.cumulativeIncome = cumulative;
        });

        res.json(data);
    } catch (error) {
        next(error);
    }
};

// Helper function to generate monthly data
function generateMonthlyData(startDate: Date, endDate: Date, transactions: any[], property: any) {
    const months = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        const monthStr = current.toLocaleDateString('en-US', { month: 'short' });
        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.createdAt);
            return tDate.getMonth() === current.getMonth() && tDate.getFullYear() === current.getFullYear();
        });

        const revenue = monthTransactions
            .filter(t => t.type === 'DISTRIBUTION')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        // Estimate expenses as a percentage of revenue
        const expenses = revenue * 0.30;

        months.push({
            month: monthStr,
            revenue: Math.round(revenue),
            expenses: Math.round(expenses)
        });

        current.setMonth(current.getMonth() + 1);
    }

    return months;
}

function getTransactionDescription(type: string): string {
    const descriptions: Record<string, string> = {
        DISTRIBUTION: 'Rental Distribution',
        OWNERSHIP_REGISTRATION: 'Property Purchase',
        WALLET_DEPOSIT: 'Wallet Deposit',
        WALLET_WITHDRAWAL: 'Wallet Withdrawal'
    };
    return descriptions[type] || 'Transaction';
}
