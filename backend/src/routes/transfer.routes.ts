import { Router } from 'express';
import * as transferController from '../controllers/transfer.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

// User routes
router.post('/', transferController.createTransferRequest);
router.get('/', transferController.getMyTransferRequests);
router.get('/:id', transferController.getTransferRequestById);

// Admin routes
router.put('/:id/approve', authorize('ADMIN', 'SUPER_ADMIN'), transferController.approveTransferRequest);
router.put('/:id/reject', authorize('ADMIN', 'SUPER_ADMIN'), transferController.rejectTransferRequest);

export default router;
