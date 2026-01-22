
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting Admin Passwords...');

    // 1. Reset Super Admin
    const superAdminEmail = 'superadmin@hermeos.com';
    const superAdminPass = 'SuperAdmin@2026!';
    const superAdminHash = await bcrypt.hash(superAdminPass, 12);

    try {
        await prisma.user.update({
            where: { email: superAdminEmail },
            data: { password: superAdminHash },
        });
        console.log(`[SUCCESS] Super Admin (${superAdminEmail}) password reset to: ${superAdminPass}`);
    } catch (error) {
        console.log(`[Re-creating] Super Admin not found, creating new...`);
        // Fallback to create if not found, though seed should have handled it.
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
        console.log(`[SUCCESS] Super Admin created with password: ${superAdminPass}`);
    }

    // 2. Reset Admin
    const adminEmail = 'admin@hermeos.com';
    const adminPass = 'Admin@2026!';
    const adminHash = await bcrypt.hash(adminPass, 12);

    try {
        await prisma.user.update({
            where: { email: adminEmail },
            data: { password: adminHash },
        });
        console.log(`[SUCCESS] Admin (${adminEmail}) password reset to: ${adminPass}`);
    } catch (error) {
        console.log(`[Re-creating] Admin not found, creating new...`);
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
        console.log(`[SUCCESS] Admin created with password: ${adminPass}`);
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
