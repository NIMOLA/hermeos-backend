import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
    initializeSuperAdmin,
    createAdminInvitation,
    acceptAdminInvitation,
    listAdmins,
    updateAdminRole,
    revokeAdminAccess,
    getAdminUserDetail,
    suspendUser,
    updateUserProfile,
    getAdminAuditLogs
} from '../controllers/adminManagement.controller';

const router = Router();

// Public route - initialize super admin (requires master key)
router.post('/init-super-admin', initializeSuperAdmin);

// Public route - accept invitation
router.post('/accept-invitation/:token', acceptAdminInvitation);

// Protected routes - require authentication
router.use(protect);

// Super admin only routes
router.post('/create-invitation', authorize('SUPER_ADMIN'), createAdminInvitation);
router.get('/list-admins', authorize('SUPER_ADMIN'), listAdmins);
router.patch('/:adminId/role', authorize('SUPER_ADMIN'), updateAdminRole);
router.delete('/:adminId/revoke', authorize('SUPER_ADMIN'), revokeAdminAccess);

// User Management Routes
router.get('/users/:userId', getAdminUserDetail);
router.put('/users/:userId/suspend', suspendUser);
router.put('/users/:userId/suspend', suspendUser);
router.put('/users/:userId/profile', updateUserProfile);

// Audit Logs
router.get('/audit-logs', getAdminAuditLogs);

export default router;
