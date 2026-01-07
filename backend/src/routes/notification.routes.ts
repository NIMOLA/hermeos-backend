import { Router } from 'express';
import { protect } from '../middleware/auth';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.use(protect);

router.get('/', async (req: Request, res: Response) => {
    res.json({ success: true, data: [], message: 'Notification routes placeholder' });
});

export default router;
