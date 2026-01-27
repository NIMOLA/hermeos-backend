
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.property.count();
        console.log(`Total Properties: ${count}`);

        const properties = await prisma.property.findMany();
        console.log(JSON.stringify(properties, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
