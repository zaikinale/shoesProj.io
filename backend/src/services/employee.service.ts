import { prisma } from '../utils/prismaClient';
import bcrypt from 'bcrypt';

const ADMIN_ROLE_ID = 3;

export class EmployeeService {
    static async getAll() {
        return prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                roleID: true,
                role: { select: { name: true } },
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async create(data: any) {
        const { username, email, password, roleID } = data;
        
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new Error('EMAIL_EXISTS');

        const hashedPassword = await bcrypt.hash(password, 10);

        return prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                roleID: roleID || 1
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleID: true,
                createdAt: true
            }
        });
    }

    static async updateRole(id: number, newRoleId: number, currentUserId: number) {
        const target = await prisma.user.findUnique({ where: { id } });
        if (!target) throw new Error('NOT_FOUND');

        if (target.roleID === ADMIN_ROLE_ID && target.id !== currentUserId) {
            throw new Error('CANNOT_MODIFY_ADMIN');
        }

        const roleExists = await prisma.role.findUnique({ where: { id: newRoleId } });
        if (!roleExists) throw new Error('INVALID_ROLE');

        return prisma.user.update({
            where: { id },
            data: { roleID: newRoleId },
            select: {
                id: true,
                username: true,
                email: true,
                roleID: true,
                role: { select: { name: true } }
            }
        });
    }

    static async delete(id: number, currentUserId: number) {
        const target = await prisma.user.findUnique({ where: { id } });
        if (!target) throw new Error('NOT_FOUND');

        if (target.id === currentUserId) throw new Error('SELF_DELETION');
        if (target.roleID === ADMIN_ROLE_ID) throw new Error('CANNOT_DELETE_ADMIN');

        return prisma.user.delete({ where: { id } });
    }

    static async getRoles() {
        return prisma.role.findMany({
            select: { id: true, name: true },
            orderBy: { id: 'asc' }
        });
    }
}