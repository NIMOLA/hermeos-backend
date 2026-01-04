import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../server';

const router = express.Router();
const googleClient = new OAuth2Client(
    '476027201176-q8b9uh3uj7p119t7kklkgq5790joubor.apps.googleusercontent.com'
);

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

// Google Login
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Token is required' });

        // Verify Google Token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: '476027201176-q8b9uh3uj7p119t7kklkgq5790joubor.apps.googleusercontent.com'
        });

        const payload = ticket.getPayload();
        if (!payload) return res.status(400).json({ error: 'Invalid token payload' });

        const { email, sub: googleId, given_name, family_name, email_verified } = payload;

        if (!email) return res.status(400).json({ error: 'Email not found in token' });

        // Find user by Google ID or Email
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId },
                    { email }
                ]
            }
        });

        if (user) {
            // Update Google ID if missing (e.g. user signed up with email before)
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        } else {
            // Create new user
            // Password is required in schema but not used for social login. We generate a random one.
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
                data: {
                    email,
                    googleId,
                    password: hashedPassword,
                    role: 'USER',
                    kycStatus: email_verified ? 'VERIFIED' : 'NOT_STARTED', // Consider email verification as partial KYC or keep NOT_STARTED
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
        }

        // Generate Token
        const jwtToken = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.json({ token: jwtToken, role: user.role, kycStatus: user.kycStatus, user });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ error: 'Server error during google login' });
    }
});

export default router;
