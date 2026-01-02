import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding capabilities...');

    const capabilities = [
        // Tier 1 (Default)
        { name: 'browse_marketplace', description: 'View available properties', defaultOnSignup: true },
        { name: 'view_pricing', description: 'See asset pricing details', defaultOnSignup: true },
        { name: 'bookmark_assets', description: 'Save properties to wishlist', defaultOnSignup: true },
        { name: 'initiate_investment', description: 'Start investment process', defaultOnSignup: true },

        // Tier 2 (Verified)
        { name: 'execute_investment', description: 'Finalize and pay for investments', defaultOnSignup: false },
        { name: 'access_reports', description: 'View detailed financial reports', defaultOnSignup: false },
        { name: 'transfer_assets', description: 'Transfer ownership to others', defaultOnSignup: false },
        { name: 'withdraw_funds', description: 'Withdraw form wallet', defaultOnSignup: false },
    ];

    for (const cap of capabilities) {
        await prisma.capability.upsert({
            where: { name: cap.name },
            update: { defaultOnSignup: cap.defaultOnSignup },
            create: cap,
        });
    }

    console.log('Capabilities seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
