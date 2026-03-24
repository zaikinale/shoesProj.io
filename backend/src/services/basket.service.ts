import { prisma } from '../utils/prismaClient';

export class BasketService {
    static async getBasket(userId: number) {
        return prisma.basket.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { good: true },
                    where: { good: { isActive: true } }
                }
            }
        });
    }

    static async clearBasket(userId: number) {
        return prisma.basketItem.deleteMany({
            where: { basket: { userId } }
        });
    }

    static async addItem(userId: number, goodId: number, quantity: number) {
        const good = await prisma.good.findUnique({
            where: { id: goodId },
            select: { id: true, isActive: true }
        });

        if (!good || !good.isActive) {
            throw new Error('GOOD_NOT_AVAILABLE');
        }

        let basket = await prisma.basket.findUnique({ where: { userId } });
        if (!basket) {
            basket = await prisma.basket.create({ data: { userId } });
        }

        const item = await prisma.basketItem.upsert({
            where: { basketId_goodId: { basketId: basket.id, goodId } },
            update: { quantity: { increment: quantity } },
            create: { basketId: basket.id, goodId, quantity },
            include: { good: true }
        });

        return item;
    }

    static async updateItem(userId: number, itemId: number, quantity: number) {
        const item = await prisma.basketItem.findFirst({
            where: { id: itemId, basket: { userId } },
            include: { good: true }
        });

        if (!item) throw new Error('ITEM_NOT_FOUND');
        if (!item.good.isActive && quantity > 0) throw new Error('GOOD_INACTIVE');

        return prisma.basketItem.update({
            where: { id: itemId },
            data: { quantity }
        });
    }

    static async deleteItem(userId: number, itemId: number) {
        const item = await prisma.basketItem.findFirst({
            where: { id: itemId, basket: { userId } }
        });

        if (!item) throw new Error('ITEM_NOT_FOUND');

        return prisma.basketItem.delete({ where: { id: itemId } });
    }
}