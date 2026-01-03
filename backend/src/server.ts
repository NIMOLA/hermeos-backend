import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load env vars
dotenv.config();

// Routes
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';

const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// CRITICAL: specific routes registered BEFORE generic ones
// Admin routes (Protected, more specific)
app.use('/api/admin', adminRoutes);

// General User routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// Root Check
app.get('/', (req, res) => {
    res.json({ message: 'Hermeos PropTech API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
