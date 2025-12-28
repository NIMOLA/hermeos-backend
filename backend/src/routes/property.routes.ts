import { Router } from 'express';
import { body } from 'express-validator';
import * as propertyController from '../controllers/property.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

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

router.get('/:id/distributions', propertyController.getPropertyDistributions);

export default router;
