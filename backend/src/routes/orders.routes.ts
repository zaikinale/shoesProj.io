import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;

    try {
        const basket = await prisma.basket.findUnique({
            where: { userId: user.id },
            include: {
                items: {
                    include: { good: true }
                }
            }
        });

        if (!basket || basket.items.length === 0) {
            return res.status(400).json({ error: 'Basket is empty' });
        }

        const inactiveGoods = basket.items.filter(item => !item.good.isActive);

        if (inactiveGoods.length > 0) {
            const titles = inactiveGoods.map(i => i.good.title).join(', ');
            return res.status(400).json({
                error: 'Некоторые товары в корзине более недоступны',
                details: `Недоступные товары: ${titles}`
            });
        }

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: user.id,
                    status: 'created'
                }
            });

            const orderItemsData = basket.items.map(item => ({
                orderId: newOrder.id,
                goodId: item.goodId,
                quantity: item.quantity
            }));

            await tx.orderItem.createMany({
                data: orderItemsData
            });

            await tx.basketItem.deleteMany({
                where: { basketId: basket.id }
            });

            return await tx.order.findUnique({
                where: { id: newOrder.id },
                include: {
                    items: { include: { good: true } },
                    user: { select: { id: true, username: true, email: true } }
                }
            });
        });

        res.status(201).json(order);
    } catch (error: any) {
        console.error('Create order error:', error.message);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (user.roleID !== 2 && user.roleID !== 3) {
        return res.status(403).json({ error: 'Access denied. Manager or Admin required' });
    }

    try {
        const orders = await prisma.order.findMany({
            include: {
                items: { include: { good: true } },
                user: { select: { id: true, username: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.get('/my', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;

    try {
        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                items: {
                    include: { good: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error('Fetch my orders error:', error);
        res.status(500).json({ error: 'Failed to fetch my orders' });
    }
});

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const orderId = parseInt(req.params.id as string);

    if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID format' });
    }

    try {
        let order;

        if (user.roleID === 2 || user.roleID === 3) {
            order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    items: { include: { good: true } },
                    user: { select: { id: true, username: true, email: true } }
                }
            });
        } else {
            order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    userId: user.id
                },
                include: {
                    items: { include: { good: true } }
                }
            });
        }

        if (!order) {
            return res.status(404).json({ error: 'Order not found or access denied' });
        }

        res.json(order);
    } catch (error) {
        console.error('Fetch order by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

router.put('/:id/status', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const orderId = parseInt(req.params.id as string);
    const { status } = req.body;

    if (user.roleID !== 2 && user.roleID !== 3) {
        return res.status(403).json({ error: 'Access denied. Manager or Admin required' });
    }

    const validStatuses = ['created', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
    }

    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                items: { include: { good: true } },
                user: { select: { id: true, username: true, email: true } }
            }
        });
        res.json(order);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Order not found' });
        }
        console.error('Update order status error:', error.message);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

router.delete('/:id/cancel', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const orderId = parseInt(req.params.id as string);

    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: user.id,
                status: { in: ['created', 'processing'] }
            }
        });

        if (!order) {
            return res.status(403).json({
                error: 'Order not found, already shipped/delivered, or not yours'
            });
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'cancelled' }
        });

        res.json({ message: 'Order cancelled successfully' });
    } catch (error: any) {
        console.error('Cancel order error:', error.message);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

export default router;