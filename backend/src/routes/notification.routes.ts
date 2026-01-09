import { Router } from 'express';
import { protect } from '../middleware/auth';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.use(protect);

router.get('/', async (req: Request, res: Response) => {
    // In a real app, fetch from DB. For now, return mock data or empty array
    // const notifications = await prisma.notification.findMany({ where: { userId: req.user.id } });
    res.json({
        success: true,
        data: [
            { id: '1', type: 'success', title: 'Dividend Distribution', message: 'You received ₦125,000.00 dividend from Oceanview Apartments.', createdAt: new Date(Date.now() - 7200000).toISOString(), read: false },
            { id: '2', type: 'info', title: 'New Asset Listed', message: 'Greenfield Estate, Abuja is now open for co-ownership.', createdAt: new Date(Date.now() - 86400000).toISOString(), read: false },
            { id: '3', type: 'warning', title: 'KYC Update Required', message: 'Please update your proof of address to ensure compliance.', createdAt: new Date(Date.now() - 259200000).toISOString(), read: true }
        ],
        message: 'Notifications fetched'
    });
});

router.put('/read-all', async (req: Request, res: Response) => {
    // await prisma.notification.updateMany({ where: { userId: req.user.id }, data: { read: true } });
    res.json({ success: true, message: 'All notifications marked as read' });
});

export default router;
