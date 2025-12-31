import { Router } from 'express';
import { protect, requireRole } from '../middleware/auth';
import {
    getDashboardStats,
    getRecentActivity,
    getAllUsers,
    getUserStats
} from '../controllers/adminDashboard.controller';

const router = Router();

// All routes require admin authentication
router.use(protect);
router.use(requireRole(['ADMIN', 'SUPER_ADMIN', 'MODERATOR']));

// Dashboard stats
router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);

// User management
router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);

export default router;
