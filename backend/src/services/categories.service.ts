import { prisma } from '../utils/prismaClient';

export class CategoryService {
    static async getAll() {
        return prisma.category.findMany({
            include: { _count: { select: { goods: true } } },
            orderBy: { name: 'asc' }
        });
    }

    static async getById(id: number) {
        return prisma.category.findUnique({
            where: { id },
            include: {
                goods: {
                    where: { isActive: true },
                    select: { id: true, title: true, price: true, image: true }
                }
            }
        });
    }

    static async create(name: string, description?: string) {
        return prisma.category.create({
            data: { name, description: description || null }
        });
    }

    static async update(id: number, description?: string) {
        return prisma.category.update({
            where: { id },
            data: { description: description ?? undefined }
        });
    }

    static async delete(id: number) {
        return prisma.category.delete({ where: { id } });
    }

    static async addGoodToCategory(categoryId: number, goodId: number) {
        return prisma.category.update({
            where: { id: categoryId },
            data: { goods: { connect: { id: goodId } } },
            include: { goods: true }
        });
    }

    static async removeGoodFromCategory(categoryId: number, goodId: number) {
        return prisma.category.update({
            where: { id: categoryId },
            data: { goods: { disconnect: { id: goodId } } }
        });
    }

    static async getGoodsByCategoryId(id: number) {
        return prisma.good.findMany({
            where: { categories: { some: { id } }, isActive: true },
            select: { id: true, title: true, description: true, price: true, image: true, createdAt: true }
        });
    }

    static async getCategoriesByGoodId(goodId: number) {
        return prisma.category.findMany({
            where: { goods: { some: { id: goodId } } },
            select: { id: true, name: true, description: true },
            orderBy: { name: 'asc' }
        });
    }
}