import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/overview', userController.getOverview);
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/:id/read', userController.markNotificationRead);
router.get('/documents', userController.getDocuments);

export default router;
