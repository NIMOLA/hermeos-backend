import rateLimit from 'express-rate-limit';

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many requests',
            message: 'Too many authentication attempts. Please wait 15 minutes and try again.',
            retryAfter: Math.ceil(req.rateLimit.resetTime! / 1000)
        });
    }
});

// Medium rate limiter for sensitive operations
export const sensitiveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many requests for this operation',
    standardHeaders: true,
    legacyHeaders: false
});

// Standard API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many API requests',
    standardHeaders: true,
    legacyHeaders: false
});

// Public endpoint limiter
export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false
});

// Payment-specific limiter
export const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 payment attempts per hour
    message: 'Too many payment attempts',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});

// 2FA verification limiter
export const twoFactorLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 2FA attempts per 15 minutes
    message: 'Too many 2FA verification attempts',
    standardHeaders: true,
    legacyHeaders: false
});
