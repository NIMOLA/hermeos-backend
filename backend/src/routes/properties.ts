import express from 'express';
import { prisma } from '../server';
import { verifyToken, hasCapability } from '../middleware/auth';

const router = express.Router();

// Public / Market View (Protected by capability, but basic user has it)
router.get('/', verifyToken, hasCapability('market_view'), async (req, res) => {
    try {
        const properties = await prisma.property.findMany();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Admin Create Property
router.post('/', verifyToken, hasCapability('manage_properties'), async (req, res) => {
    try {
        const { title, description, price, roi, images } = req.body as any;

        const property = await prisma.property.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                roi: parseFloat(roi),
                images: images || []
            }
        });

        res.json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create property' });
    }
});

export default router;
