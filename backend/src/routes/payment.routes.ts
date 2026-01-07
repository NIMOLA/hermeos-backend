import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    initializeCardPayment,
    verifyCardPayment,
    submitBankTransferProof,
    getMyPaymentProofs,
    getBankDetails
} from '../controllers/payment.controller';
import { bankTransferProofValidation, uuidParamValidation } from '../middleware/validators';
import { paymentLimiter } from '../middleware/rateLimiter';
import { validationResult } from 'express-validator';

const router = Router();

// Validation error handler
const handleValidationErrors = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// All routes require authentication
router.use(protect);

// Card payment routes with rate limiting
router.post('/card/initialize', paymentLimiter, initializeCardPayment);
router.get('/card/verify/:reference', paymentLimiter, verifyCardPayment);

// Bank transfer routes with validation and rate limiting
router.post('/bank-transfer/submit-proof', paymentLimiter, bankTransferProofValidation, handleValidationErrors, submitBankTransferProof);
router.get('/bank-transfer/my-proofs', getMyPaymentProofs);
router.get('/bank-transfer/details', getBankDetails);

export default router;
