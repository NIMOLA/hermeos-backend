import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

// CSRF protection middleware
export const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

// Generate and send CSRF token
export const generateCsrfToken = (req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            csrfToken: req.csrfToken()
        }
    });
};

// CSRF error handler
export const csrfErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            success: false,
            error: 'Invalid CSRF token',
            message: 'Form validation failed. Please refresh the page and try again.'
        });
    }
    next(err);
};
