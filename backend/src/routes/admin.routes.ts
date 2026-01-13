import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import * as adminController from '../controllers/admin.controller';
import * as adminPaymentController from '../controllers/adminPayment.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// Dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Invitation
router.post('/invite', adminController.inviteAdmin);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/verify', adminController.verifyUser);
router.put('/users/:id/role', adminController.updateUserRole);

// KYC management
router.get('/kyc/pending', adminController.getPendingKYC);
router.put('/kyc/:id/review', adminController.reviewKYC); // Mod action
router.put('/kyc/:id/approve', adminController.approveKYC);
router.put('/kyc/:id/reject', adminController.rejectKYC);

// Transfer requests
router.get('/transfers', adminController.getAllTransferRequests);

// Payment proof verification
router.get('/payment-proofs', adminPaymentController.getPendingPaymentProofs);
router.get('/payment-proofs/:id', adminPaymentController.getPaymentProofDetails);
router.post('/payment-proofs/:id/verify', adminPaymentController.verifyPaymentProof);
router.post('/payment-proofs/:id/reject', adminPaymentController.rejectPaymentProof);

// Audit logs
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
