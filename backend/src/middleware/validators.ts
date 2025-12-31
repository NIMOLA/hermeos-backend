import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Investment validation schemas
 */
export const createInvestmentValidation: ValidationChain[] = [
    body('propertyId').isUUID().withMessage('Invalid property ID'),
    body('units').isInt({ min: 1, max: 1000000 }).withMessage('Units must be between 1 and 1,000,000'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('paymentMethod').isIn(['card', 'bank_transfer']).withMessage('Invalid payment method')
];

/**
 * Exit request validation
 */
export const createExitRequestValidation: ValidationChain[] = [
    body('propertyId').isUUID().withMessage('Invalid property ID'),
    body('units').isInt({ min: 1 }).withMessage('Units must be at least 1'),
    body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason too long'),
    body('bankName').trim().isLength({ min: 2, max: 100 }).withMessage('Invalid bank name'),
    body('accountNumber').trim().isNumeric().isLength({ min: 10, max: 10 }).withMessage('Account number must be 10 digits'),
    body('accountName').trim().isLength({ min: 2, max: 100 }).withMessage('Invalid account name')
];

/**
 * User registration validation
 */
export const registerValidation: ValidationChain[] = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    body('phone').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'),
    body('tier').optional().isIn(['free', 'basic', 'premium', 'institutional']).withMessage('Invalid tier')
];

/**
 * Login validation
 */
export const loginValidation: ValidationChain[] = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
];

/**
 * Bank transfer proof validation
 */
export const bankTransferProofValidation: ValidationChain[] = [
    body('propertyId').isUUID().withMessage('Invalid property ID'),
    body('units').isInt({ min: 1 }).withMessage('Units must be at least 1'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('depositorName').trim().isLength({ min: 2, max: 100 }).withMessage('Invalid depositor name'),
    body('transferDate').isISO8601().withMessage('Invalid transfer date'),
    body('transferReference').optional().trim().isLength({ max: 100 }).withMessage('Reference too long')
];

/**
 * 2FA token validation
 */
export const twoFactorTokenValidation: ValidationChain[] = [
    body('token').isLength({ min: 6, max: 6 }).isNumeric().withMessage('Token must be 6 digits')
];

/**
 * Property search validation
 */
export const propertySearchValidation: ValidationChain[] = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
    query('type').optional().trim().isLength({ max: 50 }).withMessage('Invalid property type'),
    query('location').optional().trim().isLength({ max: 100 }).withMessage('Invalid location'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Invalid minimum price'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Invalid maximum price')
];

/**
 * UUID parameter validation
 */
export const uuidParamValidation: ValidationChain[] = [
    param('id').isUUID().withMessage('Invalid ID format')
];

/**
 * Pagination validation
 */
export const paginationValidation: ValidationChain[] = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
];

/**
 * Amount range validation
 */
export const amountValidation: ValidationChain[] = [
    body('amount').isFloat({ min: 0.01, max: 1000000000 }).withMessage('Invalid amount')
];
