// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Сидирование ролей...');

  // Создаём роли с фиксированными ID
  await prisma.role.createMany({
    data: [  // ← обязательно свойство data:
      { id: 1, name: 'User' },
      { id: 2, name: 'Manager' },
      { id: 3, name: 'Admin' },
    ],
    skipDuplicates: true,  // пропустить, если уже есть
  });

  // Сбрасываем последовательность, чтобы следующие ID шли с 4
  await prisma.$executeRaw`
    SELECT setval('"Role_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Role"), false);
  `;

  const roles = await prisma.role.findMany({ orderBy: { id: 'asc' } });
  console.log('✅ Роли созданы:', roles);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });