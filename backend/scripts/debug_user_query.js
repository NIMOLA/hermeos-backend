
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userId = "727c267d-5f69-4bbb-addf-4fc060f249c2";
    console.log(`[DEBUG] Testing query for userId: '${userId}'`);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                kyc: true,
                documents: true,
                ownerships: { include: { property: true } },
                transactions: { orderBy: { createdAt: 'desc' } },
                bankAccounts: true
            }
        });

        if (user) {
            console.log("SUCCESS: User found!");
            console.log(JSON.stringify(user, null, 2));
        } else {
            console.log("FAILURE: User returned null.");
        }

    } catch (e) {
        console.error("CRITICAL ERROR during query execution:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
