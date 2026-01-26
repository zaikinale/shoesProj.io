// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, name: 'User' },
    });

    await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: { id: 2, name: 'Manager' },
    });

    await prisma.role.upsert({
        where: { id: 3 },
        update: {},
        create: { id: 3, name: 'Admin' },
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });