import winston from 'winston';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
];

export const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

// Security event logging
export function logSecurityEvent(event: string, data: Record<string, any>) {
    logger.warn(`SECURITY: ${event}`, data);
}

// Authentication event logging  
export function logAuthEvent(event: string, userId: string | null, ip: string, success: boolean) {
    logger.info(`AUTH: ${event}`, { userId, ip, success });
}

// Financial transaction logging
export function logFinancialEvent(event: string, userId: string, amount: number, data: Record<string, any>) {
    logger.warn(`FINANCIAL: ${event}`, { userId, amount, ...data });
}
