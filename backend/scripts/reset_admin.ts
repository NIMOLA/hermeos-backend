import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Ensuring Super Admin Account...');

    const email = 'admin@hermeos.com';
    const password = 'HermeosPassword2026';

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        // Upsert: Create if missing, Update if exists
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isVerified: true,
                kycStatus: 'verified'
            },
            create: {
                email,
                password: hashedPassword,
                firstName: 'Super',
                lastName: 'Admin',
                role: 'SUPER_ADMIN',
                isVerified: true,
                kycStatus: 'verified'
            }
        });

        console.log(`✅ Admin account secured: ${user.email}`);
        console.log(`👉 Role: ${user.role}`);
        console.log(`👉 Password set to: ${password}`);
    } catch (error) {
        console.error('❌ Failed to upsert admin:', error);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
