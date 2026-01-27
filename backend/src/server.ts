import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Validate Environment
import { validateEnv } from './utils/validateEnv';
validateEnv();

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import propertyRoutes from './routes/property.routes';
import ownershipRoutes from './routes/ownership.routes';
import transactionRoutes from './routes/transaction.routes';
import transferRoutes from './routes/transfer.routes';
import notificationRoutes from './routes/notification.routes';
import documentRoutes from './routes/document.routes';
import supportRoutes from './routes/support.routes';
import adminRoutes from './routes/admin.routes';
import adminDashboardRoutes from './routes/adminDashboard.routes';
import adminManagementRoutes from './routes/adminManagement.routes';
import chatbotRoutes from './routes/chatbot.routes';
import kycRoutes from './routes/kyc.routes';
import performanceRoutes from './routes/performance.routes';
import exitRequestRoutes from './routes/exitRequest.routes';
import investmentRoutes from './routes/investment.routes';
import paymentRoutes from './routes/payment.routes';
import twoFactorRoutes from './routes/twoFactor.routes';
import uploadRoutes from './routes/upload.routes';
import bankRoutes from './routes/bank.routes';
import path from 'path';

const app: Application = express();
export const prisma = new PrismaClient();

// Trust proxy - required when behind Nginx/reverse proxy
// Using 'loopback, linklocal, uniquelocal' to correctly identify IPs behind Docker/Nginx
app.set('trust proxy', 'loopback, linklocal, uniquelocal');

// Security Middleware
app.use(helmet());

// Parse allowed origins from env var (comma-separated)
// Parse allowed origins from env var (comma-separated)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(url => url.trim());

// Regex for allowed domains (including all subdomains)
const allowedDomainsRegex = [
    /^https?:\/\/(?:.+\.)?hermeos\.com$/,
    /^https?:\/\/(?:.+\.)?hermeosproptech\.com$/,
    /^http:\/\/localhost:\d+$/,
    /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?$/ // Allow raw IP access (e.g. http://45.x.x.x)
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check against static list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Check against regex patterns
        const isAllowedByRegex = allowedDomainsRegex.some(regex => regex.test(origin));
        if (isAllowedByRegex) {
            return callback(null, true);
        }

        // Log blocked origin for debugging
        logger.warn(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit for testing/Docker NAT scenarios
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: (message: string) => logger.info(message.trim()) }
    }));
}

// Root Route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to Hermeos PropTech API',
        version: '1.0.0',
        health: '/health'
    });
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/ownerships', ownershipRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/support', supportRoutes);
app.get('/api/admin/management/init-super-admin', (req, res, next) => {
    // Explicitly allow this path to bypass generic admin checks if needed,
    // though reordering below should suffice.
    next();
});

import announcementRoutes from './routes/announcement.routes';

// ... (existing imports)

import blogRoutes from './routes/blog.routes';

// ... (existing imports)

app.use('/api/admin/management', adminManagementRoutes); // MOVED UP: Must be before /api/admin to avoid blanket auth
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/announcements', announcementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/exit-requests', exitRequestRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/blog', blogRoutes); // CMS Blog Routes

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
