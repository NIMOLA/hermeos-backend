import { Router } from 'express';
import { protect } from '../middleware/auth';
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
router.post('/create-invitation', createAdminInvitation);
router.get('/list-admins', listAdmins);
router.patch('/:adminId/role', updateAdminRole);
router.delete('/:adminId/revoke', revokeAdminAccess);

// User Management Routes
router.get('/users/:userId', getAdminUserDetail);
router.put('/users/:userId/suspend', suspendUser);
router.put('/users/:userId/suspend', suspendUser);
router.put('/users/:userId/profile', updateUserProfile);

// Audit Logs
router.get('/audit-logs', getAdminAuditLogs);

export default router;
