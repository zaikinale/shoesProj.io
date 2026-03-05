// prisma/create-admin.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Создание администратора...');

  let adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'admin' },
    });
    console.log('✅ Роль admin создана:', adminRole);
  } else {
    console.log('✅ Роль admin уже существует:', adminRole);
  }

  const plainPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('✅ Пароль захеширован');

  const existingUser = await prisma.user.findUnique({
    where: { email: 'testadmin@mail.ru' },
  });

  if (existingUser) {
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: { roleID: adminRole.id }, 
    });
    console.log('✅ Пользователь обновлён:', {
      id: updated.id,
      email: updated.email,
      roleId: updated.roleID,
    });
  } else {
    const admin = await prisma.user.create({
      data: {
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