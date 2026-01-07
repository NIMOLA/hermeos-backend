import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

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

dotenv.config();

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: (message: string) => logger.info(message.trim()) }
    }));
}

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
app.use('/api/admin', adminRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/management', adminManagementRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/exit-requests', exitRequestRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/2fa', twoFactorRoutes);

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
