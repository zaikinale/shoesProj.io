import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.createMany({
        data: [
            { id: 1, name: 'USER' },
            { id: 2, name: 'MANAGER' },
            { id: 3, name: 'ADMIN' },
        ],
        skipDuplicates: true,
    });
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
});