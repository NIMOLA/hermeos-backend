import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_ACCOUNTS = [
    {
        email: 'superadmin@hermeos.com',
        password: 'SuperAdmin@2026!',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN'
    },
    {
        email: 'admin@hermeos.com',
        password: 'Admin@2026!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
    },
    {
        email: 'moderator@hermeos.com',
        password: 'Moderator@2026!',
        firstName: 'Moderator',
        lastName: 'User',
        role: 'MODERATOR'
    }
];

async function main() {
    console.log('🔄 Setting up Admin Accounts...\n');

    for (const account of ADMIN_ACCOUNTS) {
        const hashedPassword = await bcrypt.hash(account.password, 12);

        const user = await prisma.user.upsert({
            where: { email: account.email },
            update: {
                password: hashedPassword,
                role: account.role as any,
                isVerified: true,
                kycStatus: 'verified'
            },
            create: {
                email: account.email,
                password: hashedPassword,
                firstName: account.firstName,
                lastName: account.lastName,
                role: account.role as any,
                isVerified: true,
                kycStatus: 'verified'
            }
        });

        console.log(`✅ ${account.role}: ${user.email}`);
        console.log(`   Password: ${account.password}\n`);
    }

    console.log('🎉 All admin accounts ready!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
