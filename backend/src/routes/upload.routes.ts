import { Router } from 'express';
import { upload, uploadFile } from '../controllers/upload.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Protect all upload routes
router.use(protect);

// POST /api/upload
router.post('/', upload.single('file'), uploadFile);

export default router;
