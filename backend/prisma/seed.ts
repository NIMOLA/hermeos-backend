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

    // Seed Admin Accounts
    const bcrypt = require('bcryptjs');

    // Super Admin
    const superAdminEmail = 'superadmin@hermeos.com';
    const superAdminPassword = await bcrypt.hash('SuperAdmin@2026!', 12);

    const superAdmin = await prisma.user.upsert({
        where: { email: superAdminEmail },
        update: {},
        create: {
            email: superAdminEmail,
            password: superAdminPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'SUPER_ADMIN',
            isVerified: true,
            tier: 'Institutional',
            capabilities: {
                create: capabilities.map(cap => ({
                    capability: { connect: { name: cap.name } }
                }))
            }
        },
    });

    // Admin
    const adminEmail = 'admin@hermeos.com';
    const adminPassword = await bcrypt.hash('Admin@2026!', 12);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: adminPassword,
            firstName: 'Platform',
            lastName: 'Admin',
            role: 'ADMIN',
            isVerified: true,
            tier: 'Institutional',
            capabilities: {
                create: capabilities.filter(c => ['market_view', 'admin_dashboard', 'manage_properties'].includes(c.name)).map(cap => ({
                    capability: { connect: { name: cap.name } }
                }))
            }
        },
    });

    // Moderator
    const moderatorEmail = 'moderator@hermeos.com';
    const moderatorPassword = await bcrypt.hash('Moderator@2026!', 12);

    const moderator = await prisma.user.upsert({
        where: { email: moderatorEmail },
        update: {},
        create: {
            email: moderatorEmail,
            password: moderatorPassword,
            firstName: 'Platform',
            lastName: 'Moderator',
            role: 'MODERATOR',
            isVerified: true,
            tier: 'Professional',
            capabilities: {
                create: capabilities.filter(c => ['market_view', 'admin_dashboard'].includes(c.name)).map(cap => ({
                    capability: { connect: { name: cap.name } }
                }))
            }
        },
    });

    console.log(`Seeding complete. Admin accounts created:`);
    console.log(`- Super Admin: ${superAdminEmail} / SuperAdmin@2026!`);
    console.log(`- Admin: ${adminEmail} / Admin@2026!`);
    console.log(`- Moderator: ${moderatorEmail} / Moderator@2026!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
