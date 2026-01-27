
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CapabilityService } from '../src/services/capability.service';

const prisma = new PrismaClient();

async function reproduceIssue() {
    const email = 'osas3035@gmail.com'; // From screenshot
    const password = 'Osas@12345';       // From screenshot
    const firstName = 'Osas';
    const lastName = 'love';
    const phone = '08188246697';         // From screenshot

    console.log('Attempting signup with specific user data:', { email, firstName, lastName, phone });

    try {
        // 1. Check existing
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log('User ALREADY exists in DB. This would cause "Email already registered" error (400).');
            console.log('Existing user ID:', existing.id);
            return;
        } else {
            console.log('User does not exist in DB.');
        }

        // 2. Simulate Controller Logic
        const hashedPassword = await bcrypt.hash(password, 12);

        console.log('Creating user in DB...');
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                tier: 'Tier 1',
                verificationCode: '123456',
                verificationExpires: new Date(Date.now() + 3600000)
            }
        });
        console.log('User created successfully:', user.id);

        console.log('Assigning capabilities...');
        await CapabilityService.assignDefaultCapabilities(user.id);
        console.log('Capabilities assigned.');

    } catch (error: any) {
        console.error('ERROR CAUGHT DURING REPRODUCTION:', error);
        const fs = require('fs');
        fs.writeFileSync('debug_error.log', JSON.stringify(error, null, 2) + '\n' + error.message + '\n' + error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

reproduceIssue();
