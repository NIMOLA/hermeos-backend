import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

const router = express.Router();

// Register
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'USER',
                kycStatus: 'NOT_STARTED'
            }
        });

        // Assign default capabilities
        const defaultCaps = await prisma.capability.findMany({ where: { defaultOnSignup: true } });

        for (const cap of defaultCaps) {
            await prisma.userCapability.create({
                data: {
                    userId: user.id,
                    capabilityId: cap.id
                }
            });
        }

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.role, kycStatus: user.kycStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

export default router;
