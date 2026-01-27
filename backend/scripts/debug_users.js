
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, firstName: true, lastName: true, role: true }
        });
        const outputPath = path.join(__dirname, 'users_dump.json');
        fs.writeFileSync(outputPath, JSON.stringify(users, null, 2));
        console.log('Users dumped to users_dump.json');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
