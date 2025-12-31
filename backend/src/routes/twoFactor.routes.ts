import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    setup2FA,
    verify2FA,
    validate2FAToken,
    disable2FA,
    get2FAStatus
} from '../controllers/twoFactor.controller';

const router = Router();

// Get 2FA status (public)
router.post('/validate', validate2FAToken);

// All other routes require authentication
router.use(protect);

// 2FA management
router.get('/status', get2FAStatus);
router.post('/setup', setup2FA);
router.post('/verify', verify2FA);
router.post('/disable', disable2FA);

export default router;
