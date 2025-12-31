import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get comprehensive property details
export const getPropertyDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Optional - for checking ownership

        // Fetch property with all related data
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                ownerships: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                distributions: {
                    orderBy: { distributionDate: 'desc' },
                    take: 5
                }
            }
        });

        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        // Check if user owns this property
        let userOwnership = null;
        if (userId) {
            userOwnership = await prisma.ownership.findFirst({
                where: {
                    userId,
                    propertyId: id
                }
            });
        }

        // Calculate metrics
        const totalOwnerships = property.ownerships.length;
        const totalUnitsOwned = property.ownerships.reduce((sum, o) => sum + o.units, 0);
        const fundingProgress = (totalUnitsOwned / property.totalUnits) * 100;

        // Calculate expected yield
        const expectedYield = property.expectedAnnualIncome && property.totalValue
            ? (Number(property.expectedAnnualIncome) / Number(property.totalValue)) * 100
            : 0;

        // Calculate total distributions paid
        const totalDistributed = property.distributions.reduce(
            (sum, d) => sum + Number(d.amount),
            0
        );

        // Format response
        res.json({
            property: {
                id: property.id,
                name: property.name,
                description: property.description,
                location: property.location,
                address: property.address,

                // Financial
                totalValue: Number(property.totalValue),
                pricePerUnit: Number(property.pricePerUnit),
                totalUnits: property.totalUnits,
                availableUnits: property.availableUnits,
                expectedAnnualIncome: property.expectedAnnualIncome ? Number(property.expectedAnnualIncome) : null,
                expectedYield: parseFloat(expectedYield.toFixed(2)),

                // Details
                propertyType: property.propertyType,
                size: property.size,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,

                // Status
                status: property.status.toLowerCase(),
                listedAt: property.listedAt,
                lastDistributionDate: property.lastDistributionDate,

                // Media
                images: property.images,
                documents: property.documents,
                titleDeedUrl: property.titleDeedUrl,
                certificateUrl: property.certificateUrl,

                // Metrics
                fundingProgress: parseFloat(fundingProgress.toFixed(2)),
                totalInvestors: totalOwnerships,
                totalDistributed
            },
            ownership: userOwnership ? {
                isOwner: true,
                units: userOwnership.units,
                percentage: parseFloat(((userOwnership.units / property.totalUnits) * 100).toFixed(2)),
                acquisitionPrice: Number(userOwnership.acquisitionPrice),
                acquisitionDate: userOwnership.acquisitionDate,
                currentValue: (userOwnership as any).currentValue ? Number((userOwnership as any).currentValue) : Number(userOwnership.acquisitionPrice)
            } : {
                isOwner: false
            },
            distributions: property.distributions.map(d => ({
                id: d.id,
                amount: Number(d.amount),
                date: d.distributionDate,
                period: d.period,
                description: d.description
            })),
            investors: property.ownerships.slice(0, 5).map(o => ({
                name: `${o.user.firstName} ${o.user.lastName.charAt(0)}.`,
                units: o.units,
                percentage: parseFloat(((o.units / property.totalUnits) * 100).toFixed(2))
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Get property performance metrics
export const getPropertyPerformanceMetrics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                distributions: true,
                transactions: {
                    where: {
                        type: 'DISTRIBUTION',
                        status: 'COMPLETED'
                    }
                }
            }
        });

        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        // Calculate metrics by month
        const monthlyMetrics: Record<string, { income: number; distributions: number }> = {};

        property.distributions.forEach(dist => {
            const month = new Date(dist.distributionDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            });

            if (!monthlyMetrics[month]) {
                monthlyMetrics[month] = { income: 0, distributions: 0 };
            }

            monthlyMetrics[month].income += Number(dist.amount);
            monthlyMetrics[month].distributions += 1;
        });

        const metrics = Object.entries(monthlyMetrics).map(([month, data]) => ({
            month,
            income: data.income,
            distributions: data.distributions
        }));

        // Calculate occupancy trend (mock for now)
        const occupancyTrend = metrics.map(m => ({
            month: m.month,
            occupancy: 92 + Math.floor(Math.random() * 8) // 92-100%
        }));

        res.json({
            incomeHistory: metrics,
            occupancyTrend,
            averageMonthlyIncome: metrics.length > 0
                ? metrics.reduce((sum, m) => sum + m.income, 0) / metrics.length
                : 0,
            totalDistributions: property.distributions.length
        });
    } catch (error) {
        next(error);
    }
};
