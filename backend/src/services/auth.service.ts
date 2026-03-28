import * as bcrypt from 'bcryptjs';
import { prisma } from '../utils/prismaClient';
import type { PublicAuthUser } from '../types/auth';
import { AppError } from '../utils/AppError';
import type { UpdateProfileInput, ChangePasswordInput } from '../validators/auth.schemas';

const BCRYPT_ROUNDS = 10;

/** Профиль и пароль: только Prisma ORM (без сырого SQL). */
export class AuthService {
    static async getPublicUserById(userId: number): Promise<PublicAuthUser | null> {
        return prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, roleID: true, email: true, username: true },
        });
    }

    static async updateProfile(userId: number, data: UpdateProfileInput): Promise<PublicAuthUser> {
        const updateData: { username?: string; email?: string } = {};
        if (data.username !== undefined) updateData.username = data.username;
        if (data.email !== undefined) updateData.email = data.email;

        return prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, roleID: true, email: true, username: true },
        });
    }

    static async changePassword(
        userId: number,
        payload: Pick<ChangePasswordInput, 'currentPassword' | 'newPassword'>
    ): Promise<void> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new AppError(404, 'Пользователь не найден');

        const match = await bcrypt.compare(payload.currentPassword, user.password);
        if (!match) throw new AppError(400, 'Неверный текущий пароль');

        const hashed = await bcrypt.hash(payload.newPassword, BCRYPT_ROUNDS);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
    }
}
