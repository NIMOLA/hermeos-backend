import { Router } from 'express';
import * as kycController from '../controllers/kyc.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/submit', kycController.submitKYC);
router.patch('/documents', kycController.updateKYCDocuments);
router.get('/status', kycController.getMyKYCStatus);

export default router;
