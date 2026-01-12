import { Router } from 'express';
import { protect } from '../middleware/auth';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

router.use(protect); // All routes protected

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
