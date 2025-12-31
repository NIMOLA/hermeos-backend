import { Router } from 'express';
import { body } from 'express-validator';
import * as propertyController from '../controllers/property.controller';
import * as propertyDetailsController from '../controllers/propertyDetails.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/featured', propertyController.getFeaturedProperty);
router.get('/marketplace', propertyController.getMarketplaceProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/:id/distributions', propertyController.getPropertyDistributions);

// Property details (optional auth to check ownership)
router.get('/:id/details', optionalAuth, propertyDetailsController.getPropertyDetails);
router.get('/:id/performance', protect, propertyDetailsController.getPropertyPerformanceMetrics);

// Protected routes
router.post(
    '/',
    protect,
    authorize('ADMIN', 'SUPER_ADMIN'),
    [
        body('name').trim().notEmpty(),
        body('location').trim().notEmpty(),
        body('totalValue').isNumeric(),
        body('totalUnits').isInt({ min: 1 }),
        body('pricePerUnit').isNumeric()
    ],
    propertyController.createProperty
);

router.put(
    '/:id',
    protect,
    authorize('ADMIN', 'SUPER_ADMIN'),
    propertyController.updateProperty
);

router.delete(
    '/:id',
    protect,
    authorize('SUPER_ADMIN'),
    propertyController.deleteProperty
);

export default router;
