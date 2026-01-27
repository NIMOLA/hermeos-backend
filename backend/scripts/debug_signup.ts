
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CapabilityService } from '../src/services/capability.service';

const prisma = new PrismaClient();

async function debugSignup() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'Password123!';
    const firstName = 'Test';
    const lastName = 'User';
    const phone = `+234${Date.now().toString().slice(-10)}`;

    console.log('Attempting signup with:', { email, phone });

    try {
        // 1. Check existing
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log('User exists (unexpected for restricted test)');
        }

        // 2. Hash
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create
        console.log('Creating user...');
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
        console.log('User created:', user.id);

        // 4. Caps
        console.log('Assigning capabilities...');
        await CapabilityService.assignDefaultCapabilities(user.id);
        console.log('Capabilities assigned.');

        // 5. Fetch Caps
        const caps = await prisma.userCapability.findMany({
            where: { userId: user.id }
        });
        console.log('User capabilities count:', caps.length);

        console.log('SUCCESS: Signup flow completed without error.');

    } catch (error: any) {
        console.error('ERROR CAUGHT:', error);
        if (error.code) console.error('Error Code:', error.code);
        if (error.meta) console.error('Error Meta:', error.meta);
    } finally {
        await prisma.$disconnect();
    }
}

debugSignup();
