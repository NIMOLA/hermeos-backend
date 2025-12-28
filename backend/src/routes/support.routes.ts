import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(protect);

// Submit support ticket
router.post('/', [
    body('category').notEmpty(),
    body('subject').notEmpty(),
    body('message').notEmpty()
], async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { category, subject, message, assetRef } = req.body;

        const ticket = await prisma.supportTicket.create({
            data: {
                userId: req.user!.id,
                category,
                subject,
                message,
                assetRef,
                status: 'open'
            }
        });

        res.status(201).json({
            success: true,
            data: ticket,
            message: 'Support ticket submitted successfully'
        });
    } catch (error) {
        next(error);
    }
});

// Get user's tickets
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tickets = await prisma.supportTicket.findMany({
            where: { userId: req.user!.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: tickets });
    } catch (error) {
        next(error);
    }
});

export default router;
