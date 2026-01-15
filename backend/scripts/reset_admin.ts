import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Resetting Admin Password...');

    const email = 'admin@hermeos.com';
    const newPassword = 'HermeosPassword2026';

    console.log(`Targeting user: ${email}`);

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        console.log(`✅ Password for ${user.email} successfully reset.`);
        console.log(`👉 New Password: ${newPassword}`);
    } catch (error) {
        console.error('❌ Failed to update password:', error);
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
