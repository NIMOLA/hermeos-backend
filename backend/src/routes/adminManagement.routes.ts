import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
    initializeSuperAdmin,
    createAdminInvitation,
    acceptAdminInvitation,
    listAdmins,
    updateAdminRole,
    revokeAdminAccess
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

export default router;
