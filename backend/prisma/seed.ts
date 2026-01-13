import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const capabilities = [
        { name: 'market_view', defaultOnSignup: true },
        { name: 'invest', defaultOnSignup: false }, // Requires KYC usually
        { name: 'admin_dashboard', defaultOnSignup: false },
        { name: 'manage_users', defaultOnSignup: false },
        { name: 'manage_properties', defaultOnSignup: false },
    ];

    console.log('Seeding capabilities...');

    for (const cap of capabilities) {
        await prisma.capability.upsert({
            where: { name: cap.name },
            update: {},
            create: cap,
        });
    }

    // Seed Super Admin
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Hermeos@2026!', 12);

    const adminEmail = 'admin@hermeos.com';
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'SUPER_ADMIN',
            isVerified: true,
            tier: 'Institutional', // Higher tier for admin
            capabilities: {
                create: capabilities.map(cap => ({
                    capability: { connect: { name: cap.name } }
                }))
            }
        },
    });

    console.log(`Seeding complete. Super Admin created: ${adminEmail} / Hermeos@2026!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
