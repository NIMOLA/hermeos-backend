
import { logger } from './logger';

export const validateEnv = () => {
    const requiredEnv = [
        'DATABASE_URL',
        'JWT_SECRET',
        'PAYSTACK_SECRET_KEY',
        'PAYSTACK_PUBLIC_KEY',
        'GOOGLE_CLIENT_ID',
        'CLIENT_URL',
        'SMTP_HOST',
        'SMTP_USER',
        'SMTP_PASS'
    ];

    const missingEnv = requiredEnv.filter(env => !process.env[env]);

    if (missingEnv.length > 0) {
        const message = `CRITICAL: Missing required environment variables: ${missingEnv.join(', ')}`;
        logger.error(message);

        // In production, we must fail. In dev, we might warn but usually failing is better to prevent surprises.
        if (process.env.NODE_ENV === 'production' || process.env.STRICT_ENV) {
            console.error(message);
            process.exit(1);
        } else {
            console.warn(`WARNING: Missing env vars: ${missingEnv.join(', ')}. App may not function correctly.`);
        }
    } else {
        logger.info('Environment variables validated successfully.');
    }
};
