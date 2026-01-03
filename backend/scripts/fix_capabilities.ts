
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditAndFixCapabilities() {
    console.log('Starting Capability Audit...');

    // 1. Fetch all capabilities to know what is "Verified" vs "Default"
    const verifiedCaps = await prisma.capability.findMany({
        where: { defaultOnSignup: false }
    });

    if (verifiedCaps.length === 0) {
        console.log('No verified capabilities found. Is the DB seeded?');
        return;
    }

    console.log(`Found ${verifiedCaps.length} verified capabilities: ${verifiedCaps.map(c => c.name).join(', ')}`);

    // 2. Find users who are APPROVED but missing at least one verified capability
    const approvedUsers = await prisma.user.findMany({
        where: { kycStatus: 'APPROVED' },
        include: { capabilities: true }
    });

    console.log(`Found ${approvedUsers.length} approved users.`);

    let fixedCount = 0;

    for (const user of approvedUsers) {
        const userCapIds = new Set(user.capabilities.map(uc => uc.capabilityId));

        const missingCaps = verifiedCaps.filter(vc => !userCapIds.has(vc.id));

        if (missingCaps.length > 0) {
            console.log(`User ${user.email} is missing ${missingCaps.length} capabilities. Fixing...`);

            const capsToAdd = missingCaps.map(cap => ({
                userId: user.id,
                capabilityId: cap.id
            }));

            await prisma.userCapability.createMany({
                data: capsToAdd
            });

            fixedCount++;
        }
    }

    console.log(`Audit complete. Fixed ${fixedCount} users.`);
}

auditAndFixCapabilities()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
