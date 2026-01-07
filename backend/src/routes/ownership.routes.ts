import { Router } from 'express';
import * as ownershipController from '../controllers/ownership.controller';
import { protect } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/my-ownerships', ownershipController.getMyOwnerships);
router.post('/register', ownershipController.registerOwnership);
router.get('/:id', ownershipController.getOwnershipById);

export default router;
