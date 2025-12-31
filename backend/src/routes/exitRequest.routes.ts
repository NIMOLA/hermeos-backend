import { Router } from 'express';
import * as exitRequestController from '../controllers/exitRequest.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

// User routes
router.get('/my-requests', exitRequestController.getMyExitRequests);
router.get('/:id', exitRequestController.getExitRequestById);
router.post('/', exitRequestController.createExitRequestValidation, exitRequestController.createExitRequest);
router.post('/:id/cancel', exitRequestController.cancelExitRequest);

export default router;
