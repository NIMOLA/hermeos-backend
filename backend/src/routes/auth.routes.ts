import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import * as twoFactorController from '../controllers/twoFactor.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Validation rules
const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('tier').optional().isIn(['basic', 'premium', 'institutional'])
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/social-login', authController.socialLogin);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', body('email').isEmail(), authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', protect, authController.getMe);
// 2FA Routes
router.post('/2fa/setup', protect, twoFactorController.setup2FA);
router.post('/2fa/verify', protect, twoFactorController.verify2FA);
router.post('/2fa/disable', protect, twoFactorController.disable2FA);

router.post('/logout', protect, authController.logout);

export default router;
