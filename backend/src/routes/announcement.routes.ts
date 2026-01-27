import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import * as announcementController from '../controllers/announcement.controller';

const router = Router();

// Protect all routes
router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.post('/', announcementController.sendAnnouncement);
router.get('/', announcementController.getAnnouncements);

export default router;
