import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../server';
import { verifyToken, hasCapability } from '../middleware/auth';

const router = express.Router();

// SUPER ADMIN INIT (Public, protected by KEY)
router.post('/management/init-super-admin', async (req, res) => {
    const { superAdminKey, email, password } = req.body;

    if (superAdminKey !== process.env.SUPER_ADMIN_KEY) {
        return res.status(403).json({ error: 'Invalid Super Admin Key' });
    }

    try {
        // Check if any super admin exists (?) - Or just allow creation if key is present
        // For safety, let's just create.

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                kycStatus: 'VERIFIED'
            }
        });

        res.json({ message: 'Super Admin initialized', userId: user.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error initializing super admin' });
    }
});

// Protected Management Routes
// Ensure only admins can access these
// We can use a middleware verifyToken here or in server.ts. 
// In server.ts we did `app.use('/api/admin', adminRoutes)`, so we need to add verifyToken to specific sub-routes OR add it to the router entirelly IF init-super-admin wasn't here.
// Since init-super-admin is here and PUBLIC (key protected), we must apply verifyToken selectively.

router.get('/users', verifyToken, hasCapability('manage_users'), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { capabilities: { include: { capability: true } } }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post('/users/:userId/capabilities', verifyToken, hasCapability('manage_users'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { capabilityName } = req.body;

        const capability = await prisma.capability.findUnique({ where: { name: capabilityName } });
        if (!capability) return res.status(404).json({ error: 'Capability not found' });

        await prisma.userCapability.create({
            data: {
                userId,
                capabilityId: capability.id
            }
        });

        res.json({ message: 'Capability added' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add capability' });
    }
});

export default router;
