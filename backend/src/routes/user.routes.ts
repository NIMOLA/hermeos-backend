import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as proceedsController from '../controllers/proceeds.controller';
import * as capabilityController from '../controllers/capability.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/overview', userController.getOverview);
router.get('/dashboard/stats', userController.getDashboardStats);
router.get('/activity', userController.getActivity);
router.get('/portfolio/summary', userController.getPortfolioSummary);
router.get('/portfolio/holdings', userController.getPortfolioHoldings);
router.get('/proceeds', proceedsController.getProceeds);
router.get('/transactions', proceedsController.getTransactionHistory);
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/:id/read', userController.markNotificationRead);
router.get('/documents', userController.getDocuments);
router.post('/bookmarks', userController.toggleSavedProperty);
router.get('/bookmarks', userController.getSavedProperties);

// Capability Routes
router.post('/unlock-capability', capabilityController.unlockCapability);
router.get('/capabilities', capabilityController.listCapabilities);

export default router;
