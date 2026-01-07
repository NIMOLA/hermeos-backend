
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting System Initialization...');

    // 1. Clean Database (Reverse order of dependencies)
    console.log('🧹 Cleaning database...');
    // Delete in order to avoid foreign key constraints
    await prisma.savedProperty.deleteMany({});
    await prisma.userCapability.deleteMany({});
    await prisma.capability.deleteMany({});
    await prisma.kYC.deleteMany({});
    await prisma.ownership.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.transferRequest.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.supportTicket.deleteMany({});
    await prisma.paymentProof.deleteMany({});
    await prisma.adminAuditLog.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.adminInvitation.deleteMany({});
    await prisma.distribution.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✓ Database wiped.');

    // 2. Seed Capabilities
    console.log('🌱 Seeding Capabilities...');

    const capabilities = [
        // Tier 1 (Default)
        {
            name: 'browse_properties',
            description: 'View property listings',
            defaultOnSignup: true
        },
        {
            name: 'view_pricing',
            description: 'View property pricing and returns',
            defaultOnSignup: true
        },
        {
            name: 'save_property',
            description: 'Bookmark properties',
            defaultOnSignup: true
        },
        {
            name: 'initiate_action',
            description: 'Start investment process (gated later)',
            defaultOnSignup: true
        },

        // Tier 2 (Verified) - NOT default
        {
            name: 'invest_funds',
            description: 'Complete investments',
            defaultOnSignup: false
        },
        {
            name: 'view_sensitive_docs',
            description: 'View Title Deeds and Legal docs',
            defaultOnSignup: false
        },
        {
            name: 'withdraw_funds',
            description: 'Withdraw from wallet',
            defaultOnSignup: false
        }
    ];

    for (const cap of capabilities) {
        await prisma.capability.create({
            data: cap
        });
    }
    console.log(`✓ Seeded ${capabilities.length} capabilities.`);

    console.log('✅ Initialization Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
