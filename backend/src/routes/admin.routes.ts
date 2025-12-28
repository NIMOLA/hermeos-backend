import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// Dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/verify', adminController.verifyUser);
router.put('/users/:id/role', adminController.updateUserRole);

// KYC management
router.get('/kyc/pending', adminController.getPendingKYC);
router.put('/kyc/:id/approve', adminController.approveKYC);
router.put('/kyc/:id/reject', adminController.rejectKYC);

// Transfer requests
router.get('/transfers', adminController.getAllTransferRequests);

// Audit logs
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
