import { Response, NextFunction } from 'express';
import { PrismaClient, PropertyStatus } from '@prisma/client';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get all properties
export const getAllProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { status, propertyType, location, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
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

        // Only show PUBLISHED (or LISTED for legacy) to non-admin users
        if (!req.user || req.user.role === 'USER') {
            where.status = { in: ['PUBLISHED', 'LISTED'] };
        }

        const [properties, total] = await Promise.all([
            prisma.property.findMany({
                where, skip, take: Number(limit), orderBy: { createdAt: 'desc' },
                select: {
                    id: true, name: true, description: true, location: true, address: true, totalValue: true,
                    totalUnits: true, pricePerUnit: true, availableUnits: true, propertyType: true,
                    size: true, bedrooms: true, bathrooms: true, expectedAnnualIncome: true,
                    status: true, images: true, listedAt: true
                }
            }),
            prisma.property.count({ where })
        ]);

        const propertiesWithStats = properties.map((p: any) => ({
            ...p,
            fundingProgress: Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100)
        }));

        res.status(200).json({ success: true, data: propertiesWithStats, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    } catch (error) { next(error); }
};

export const getPropertyById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const property = await prisma.property.findUnique({
            where: { id },
            include: { distributions: { orderBy: { distributionDate: 'desc' }, take: 10 } }
        });
        if (!property) return next(new AppError('Property not found', 404));

        // ACL Check
        const isPublic = ['PUBLISHED', 'LISTED', 'FULLY_SUBSCRIBED', 'CLOSED'].includes(property.status);
        const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(req.user?.role || '');

        if (!isPublic && !isAdmin) {
            return next(new AppError('Property not available', 403));
        }

        res.status(200).json({ success: true, data: property });
    } catch (error) { next(error); }
};

// Create (Moderator/Admin) -> Always DRAFT
export const createProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        // Allowed Roles: Moderator, Admin, Super Admin
        if (!['MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
            return next(new AppError('Unauthorized', 403));
        }

        const property = await prisma.property.create({
            data: {
                ...req.body,
                availableUnits: req.body.totalUnits,
                status: 'DRAFT' // Enforced strict start state
            }
        });
        res.status(201).json({ success: true, data: property });
    } catch (error) { next(error); }
};

// Update (Moderator/Admin)
export const updateProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const currentProp = await prisma.property.findUnique({ where: { id } });

        if (!currentProp) return next(new AppError('Property not found', 404));

        // Moderators cannot update if status is PUBLISHED (only Draft/Pending)
        if (req.user?.role === 'MODERATOR' && ['PUBLISHED', 'LISTED'].includes(currentProp.status)) {
            // Unless only submitting minor edits? Strict rule says "Cannot modify live user-visible data".
            // So we block updates to live properties for Moderators.
            return next(new AppError('Moderators cannot edit published properties', 403));
        }

        const property = await prisma.property.update({
            where: { id },
            data: req.body
        });
        res.status(200).json({ success: true, data: property });
    } catch (error) { next(error); }
};

// NEW: Submit for Review (Moderator)
export const submitProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!['MODERATOR', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
            return next(new AppError('Only Moderators can submit for review', 403));
        }

        const property = await prisma.property.update({
            where: { id },
            data: { status: 'PENDING_REVIEW' as any } // Cast for TS if Enum not generated yet
        });
        res.status(200).json({ success: true, data: property });
    } catch (error) { next(error); }
};

// NEW: Publish (Admin Only)
export const publishProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
            return next(new AppError('Only Admins can publish properties', 403));
        }

        const property = await prisma.property.update({
            where: { id },
            data: {
                status: 'PUBLISHED' as any,
                listedAt: new Date()
            }
        });
        res.status(200).json({ success: true, data: property });
    } catch (error) { next(error); }
};

// NEW: Update Price (Admin Only)
export const updatePrice = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { pricePerUnit } = req.body;

        if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
            return next(new AppError('Only Admins can change pricing', 403));
        }

        const property = await prisma.property.update({
            where: { id },
            data: { pricePerUnit }
        });
        // Log this price change!
        console.log(`[AUDIT] Price updated for Property ${id} to ${pricePerUnit} by ${req.user?.email}`);

        res.status(200).json({ success: true, data: property });
    } catch (error) { next(error); }
};


export const deleteProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const ownershipCount = await prisma.ownership.count({ where: { propertyId: id } });
        if (ownershipCount > 0) return next(new AppError('Cannot delete property with existing ownerships', 400));
        await prisma.property.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Property deleted successfully' });
    } catch (error) { next(error); }
};

export const getPropertyDistributions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const distributions = await prisma.distribution.findMany({ where: { propertyId: id }, orderBy: { distributionDate: 'desc' } });
        res.status(200).json({ success: true, data: distributions });
    } catch (error) { next(error); }
};

export const getFeaturedProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const featured = await prisma.property.findFirst({
            where: { status: { in: ['PUBLISHED', 'LISTED'] } },
            select: { id: true, name: true, location: true, propertyType: true, expectedAnnualIncome: true, totalValue: true, images: true }
        });
        if (!featured) return res.status(204).send();
        const targetYield = Number(featured.totalValue) > 0 ? `${Math.round((Number(featured.expectedAnnualIncome) / Number(featured.totalValue)) * 100)}%` : '10-12%';
        res.json({ id: featured.id, name: featured.name, location: featured.location, type: featured.propertyType, targetYield, imageUrl: featured.images?.[0] || '' });
    } catch (error) { next(error); }
};

export const getMarketplaceProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const properties = await prisma.property.findMany({
            where: { status: { in: ['PUBLISHED', 'LISTED'] } },
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, location: true, propertyType: true, bedrooms: true, bathrooms: true, size: true, listedAt: true, lastDistributionDate: true, expectedAnnualIncome: true, totalValue: true, pricePerUnit: true, totalUnits: true, availableUnits: true, images: true }
        });
        const marketplaceData = properties.map(p => {
            const targetYield = Number(p.totalValue) > 0 ? `${Math.round((Number(p.expectedAnnualIncome) / Number(p.totalValue)) * 100)}-${Math.round((Number(p.expectedAnnualIncome) / Number(p.totalValue)) * 100) + 2}%` : '10-12%';
            const fundingProgress = Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100);
            return { id: p.id, name: p.name, location: p.location, type: p.propertyType, targetYield, minInvestment: Number(p.pricePerUnit), imageUrl: p.images?.[0] || '', fundingProgress, status: fundingProgress >= 100 ? 'closed' : fundingProgress > 50 ? 'funding' : 'open' };
        });
        res.json(marketplaceData);
    } catch (error) { next(error); }
};
