
import dotenv from 'dotenv';

// Ensure environment variables are loaded before creating the client
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
