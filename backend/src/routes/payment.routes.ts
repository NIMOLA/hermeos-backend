import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    initializeCardPayment,
    verifyCardPayment,
    submitBankTransferProof,
    getMyPaymentProofs,
    getBankDetails
} from '../controllers/payment.controller';

const router = Router();

// All routes require authentication
router.use(protect);

// Card payment routes
router.post('/card/initialize', initializeCardPayment);
router.get('/card/verify/:reference', verifyCardPayment);

// Bank transfer routes
router.post('/bank-transfer/submit-proof', submitBankTransferProof);
router.get('/bank-transfer/my-proofs', getMyPaymentProofs);
router.get('/bank-transfer/details', getBankDetails);

export default router;
