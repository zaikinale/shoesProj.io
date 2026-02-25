// prisma/create-admin.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Создание администратора...');

  // 1. Ищем роль admin, если нет — создаём
  let adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'admin' },  // ← обратите внимание на data:
    });
    console.log('✅ Роль admin создана:', adminRole);
  } else {
    console.log('✅ Роль admin уже существует:', adminRole);
  }

  // 2. Хешируем пароль
  const plainPassword = 'admin123'; // ← измените на свой!
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('✅ Пароль захеширован');

  // 3. Проверяем, есть ли уже пользователь с таким email
  const existingUser = await prisma.user.findUnique({
    where: { email: 'testadmin@mail.ru' },
  });

  if (existingUser) {
    // Обновляем роль на admin
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: { roleID: adminRole.id },  // ← data: обязательно
    });
    console.log('✅ Пользователь обновлён:', {
      id: updated.id,
      email: updated.email,
      roleId: updated.roleID,
    });
  } else {
    // Создаём нового администратора
    const admin = await prisma.user.create({
      data: {  // ← data: обязательно
        username: 'admin',
        email: 'testadmin@mail.ru',
        password: hashedPassword,
        roleID: adminRole.id,
      },
    });
    console.log('✅ Администратор создан:', {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      roleId: admin.roleID,
    });
  }

  console.log('🎉 Готово! Логин: testadmin@mail.ru, Пароль: admin123');
}

main()