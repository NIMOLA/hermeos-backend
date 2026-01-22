
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting Admin Passwords (CJS)...');

    // 1. Reset Super Admin
    const superAdminEmail = 'superadmin@hermeos.com';
    const superAdminPass = 'SuperAdmin@2026!';
    const superAdminHash = await bcrypt.hash(superAdminPass, 12);

    try {
        const user = await prisma.user.findUnique({ where: { email: superAdminEmail } });
        if (user) {
            await prisma.user.update({
                where: { email: superAdminEmail },
                data: { password: superAdminHash },
            });
            console.log(`[SUCCESS] Super Admin (${superAdminEmail}) password updated.`);
        } else {
            console.log(`[INFO] Super Admin not found, creating...`);
            await prisma.user.create({
                data: {
                    email: superAdminEmail,
                    password: superAdminHash,
                    firstName: 'Super',
                    lastName: 'Admin',
                    role: 'SUPER_ADMIN',
                    isVerified: true,
                    tier: 'Institutional'
                }
            });
            console.log(`[SUCCESS] Super Admin created.`);
        }
    } catch (error) {
        console.error('[ERROR] Super Admin reset failed:', error.message);
    }

    // 2. Reset Admin
    const adminEmail = 'admin@hermeos.com';
    const adminPass = 'Admin@2026!';
    const adminHash = await bcrypt.hash(adminPass, 12);

    try {
        const user = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (user) {
            await prisma.user.update({
                where: { email: adminEmail },
                data: { password: adminHash },
            });
            console.log(`[SUCCESS] Admin (${adminEmail}) password updated.`);
        } else {
            console.log(`[INFO] Admin not found, creating...`);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: adminHash,
                    firstName: 'Platform',
                    lastName: 'Admin',
                    role: 'ADMIN',
                    isVerified: true,
                    tier: 'Institutional'
                }
            });
            console.log(`[SUCCESS] Admin created.`);
        }
    } catch (error) {
        console.error('[ERROR] Admin reset failed:', error.message);
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
