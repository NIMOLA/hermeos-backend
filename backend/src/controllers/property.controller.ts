import { Response, NextFunction } from 'express';
import { PrismaClient, PropertyStatus } from '@prisma/client';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get all properties with filtering and pagination
export const getAllProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {
            status,
            propertyType,
            location,
            minPrice,
            maxPrice,
            page = 1,
            limit = 12
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};

        if (status) where.status = status;
        if (propertyType) where.propertyType = propertyType;
        if (location) where.location = { contains: location as string, mode: 'insensitive' };
        if (minPrice || maxPrice) {
            where.pricePerUnit = {};
            if (minPrice) where.pricePerUnit.gte = Number(minPrice);
            if (maxPrice) where.pricePerUnit.lte = Number(maxPrice);
        }

        // Only show listed properties to non-admin users
        if (!req.user || req.user.role === 'USER') {
            where.status = 'LISTED';
        }

        const [properties, total] = await Promise.all([
            prisma.property.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    location: true,
                    address: true,
                    totalValue: true,
                    totalUnits: true,
                    pricePerUnit: true,
                    availableUnits: true,
                    propertyType: true,
                    size: true,
                    bedrooms: true,
                    bathrooms: true,
                    expectedAnnualIncome: true,
                    status: true,
                    images: true,
                    listedAt: true
                }
            }),
            prisma.property.count({ where })
        ]);

        const propertiesWithStats = properties.map((p: any) => ({
            ...p,
            fundingProgress: Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100)
        }));

        res.status(200).json({
            success: true,
            data: propertiesWithStats,
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

// Get property by ID
export const getPropertyById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                distributions: {
                    orderBy: { distributionDate: 'desc' },
                    take: 10
                }
            }
        });

        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        // Check if user can view this property
        if (property.status !== 'LISTED' && (!req.user || req.user.role === 'USER')) {
            return next(new AppError('Property not available', 403));
        }

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// Create property (Admin only)
export const createProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const property = await prisma.property.create({
            data: {
                ...req.body,
                availableUnits: req.body.totalUnits,
                status: 'DRAFT'
            }
        });

        res.status(201).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// Update property (Admin only)
export const updateProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const property = await prisma.property.update({
            where: { id },
            data: req.body
        });

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// Delete property (Super Admin only)
export const deleteProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Check if property has ownerships
        const ownershipCount = await prisma.ownership.count({
            where: { propertyId: id }
        });

        if (ownershipCount > 0) {
            return next(new AppError('Cannot delete property with existing ownerships', 400));
        }

        await prisma.property.delete({ where: { id } });

        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get property distributions
export const getPropertyDistributions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const distributions = await prisma.distribution.findMany({
            where: { propertyId: id },
            orderBy: { distributionDate: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: distributions
        });
    } catch (error) {
        next(error);
    }
};

// NEW: Get featured property (for frontend Phase 2)
export const getFeaturedProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const featured = await prisma.property.findFirst({
            where: {
                status: 'LISTED',
                isFeatured: true
            },
            select: {
                id: true,
                name: true,
                location: true,
                propertyType: true,
                expectedAnnualIncome: true,
                totalValue: true,
                images: true
            }
        });

        if (!featured) {
            return res.status(204).send();
        }

        // Calculate target yield
        const targetYield = featured.totalValue > 0
            ? `${Math.round((Number(featured.expectedAnnualIncome) / Number(featured.totalValue)) * 100)}%`
            : '10-12%';

        res.json({
            id: featured.id,
            name: featured.name,
            location: featured.location,
            type: getPropertyTypeLabel(featured.propertyType),
            targetYield,
            imageUrl: featured.images?.[0] || ''
        });
    } catch (error) {
        next(error);
    }
};

// NEW: Get marketplace properties (for frontend Phase 3)
export const getMarketplaceProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const properties = await prisma.property.findMany({
            where: {
                status: 'LISTED'
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                location: true,
                propertyType: true,
                expectedAnnualIncome: true,
                totalValue: true,
                pricePerUnit: true,
                totalUnits: true,
                availableUnits: true,
                images: true
            }
        });

        const marketplaceData = properties.map(p => {
            const targetYield = p.totalValue > 0
                ? `${Math.round((Number(p.expectedAnnualIncome) / Number(p.totalValue)) * 100)}-${Math.round((Number(p.expectedAnnualIncome) / Number(p.totalValue)) * 100) + 2}%`
                : '10-12%';

            const fundingProgress = Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100);

            return {
                id: p.id,
                name: p.name,
                location: p.location,
                type: getPropertyTypeLabel(p.propertyType),
                targetYield,
                minInvestment: Number(p.pricePerUnit),
                imageUrl: p.images?.[0] || '',
                fundingProgress,
                status: fundingProgress >= 100 ? 'closed' : fundingProgress > 50 ? 'funding' : 'open'
            };
        });

        res.json(marketplaceData);
    } catch (error) {
        next(error);
    }
};

// Helper function to get property type label
function getPropertyTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        RESIDENTIAL: 'Residential',
        COMMERCIAL: 'Commercial',
        INDUSTRIAL: 'Industrial',
        MIXED_USE: 'Mixed Use'
    };
    return labels[type] || type;
}
