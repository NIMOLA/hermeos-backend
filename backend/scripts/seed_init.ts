
import { PrismaClient } from '@prisma/client';
import { getAllCapabilities } from '../src/config/capabilities';

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

    // 2. Seed Capabilities from Registry
    console.log('🌱 Seeding Capabilities from Registry...');

    const capabilities = getAllCapabilities();

    for (const cap of capabilities) {
        await prisma.capability.create({
            data: {
                name: cap.name,
                description: cap.description,
                defaultOnSignup: cap.defaultOnSignup
            }
        });
    }
    console.log(`✓ Seeded ${capabilities.length} capabilities from Registry.`);

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
