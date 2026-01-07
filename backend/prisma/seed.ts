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

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
