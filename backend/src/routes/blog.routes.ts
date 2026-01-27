import { Router } from 'express';
import {
    getPublishedPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    getAdminPosts
} from '../controllers/blog.controller';
import { protect as authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public Routes
router.get('/posts', getPublishedPosts);
router.get('/posts/:slug', getPostBySlug);

// Admin Routes
router.use(authenticate); // All below require login

// Get all posts for admin table
router.get('/admin/posts', requireRole(['ADMIN', 'SUPER_ADMIN', 'MODERATOR']), getAdminPosts);

// Create, Update, Delete
router.post('/posts', requireRole(['ADMIN', 'SUPER_ADMIN']), createPost);
router.put('/posts/:id', requireRole(['ADMIN', 'SUPER_ADMIN']), updatePost);
router.delete('/posts/:id', requireRole(['ADMIN', 'SUPER_ADMIN']), deletePost);

export default router;
