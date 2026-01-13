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
    authorize('MODERATOR', 'ADMIN', 'SUPER_ADMIN'), // Moderators can Create Drafts
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
    authorize('MODERATOR', 'ADMIN', 'SUPER_ADMIN'),
    propertyController.updateProperty
);

// Workflow Actions
router.put('/:id/submit', protect, authorize('MODERATOR', 'SUPER_ADMIN'), propertyController.submitProperty);
router.put('/:id/publish', protect, authorize('ADMIN', 'SUPER_ADMIN'), propertyController.publishProperty);
router.put('/:id/price', protect, authorize('ADMIN', 'SUPER_ADMIN'), propertyController.updatePrice);

router.delete(
    '/:id',
    protect,
    authorize('SUPER_ADMIN'),
    propertyController.deleteProperty
);

export default router;
