import { prisma } from '../utils/prismaClient';

export class OrderService {
    static async createOrder(userId: number) {
        // 1. Получаем корзину
        const basket = await prisma.basket.findUnique({
            where: { userId },
            include: { items: { include: { good: true } } }
        });

        if (!basket || basket.items.length === 0) throw new Error('BASKET_EMPTY');

        // 2. Проверяем активность товаров
        const inactiveGoods = basket.items.filter(item => !item.good.isActive);
        if (inactiveGoods.length > 0) {
            const titles = inactiveGoods.map(i => i.good.title).join(', ');
            throw new Error(`INACTIVE_GOODS: ${titles}`);
        }

        // 3. Транзакция: Создаем заказ -> Копируем товары -> Чистим корзину
        return prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: { userId, status: 'created' }
            });

            const orderItemsData = basket.items.map(item => ({
                orderId: newOrder.id,
                goodId: item.goodId,
                quantity: item.quantity
            }));

            await tx.orderItem.createMany({ data: orderItemsData });
            await tx.basketItem.deleteMany({ where: { basketId: basket.id } });

            return tx.order.findUnique({
                where: { id: newOrder.id },
                include: {
                    items: { include: { good: true } },
                    user: { select: { id: true, username: true, email: true } }
                }
            });
        });
    }

    static async getAllOrders() {
        return prisma.order.findMany({
            include: {
                items: { include: { good: true } },
                user: { select: { id: true, username: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async getUserOrders(userId: number) {
        return prisma.order.findMany({
            where: { userId },
            include: { items: { include: { good: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async getOrderById(orderId: number, userId: number, isAdminOrManager: boolean) {
        const whereClause = isAdminOrManager ? { id: orderId } : { id: orderId, userId };
        
        return prisma.order.findFirst({
            where: whereClause,
            include: {
                items: { include: { good: true } },
                user: isAdminOrManager ? { select: { id: true, username: true, email: true } } : false
            }
        });
    }

    static async updateStatus(orderId: number, status: string) {
        return prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                items: { include: { good: true } },
                user: { select: { id: true, username: true, email: true } }
            }
        });
    }

    static async cancelOrder(orderId: number, userId: number) {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
                status: { in: ['created', 'processing'] }
            }
        });

        if (!order) throw new Error('CANNOT_CANCEL');

        return prisma.order.update({
            where: { id: orderId },
            data: { status: 'cancelled' }
        });
    }
}