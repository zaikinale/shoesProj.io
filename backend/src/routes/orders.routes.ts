import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/orders - Создать заказ из корзины
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

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                status: 'created'
            },
            include: {
                items: true,
                user: true
            }
        });

        const orderItems = basket.items.map(item => ({
            orderId: order.id,
            goodId: item.goodId,
            quantity: item.quantity
        }));

        await prisma.orderItem.createMany({
            data: orderItems
        });

        await prisma.basketItem.deleteMany({
            where: { basketId: basket.id }
        });

        const orderWithItems = await prisma.order.findUnique({
            where: { id: order.id },
                include: {
                    items: {
                        include: { good: true }
                    },
                user: true
            }
        });

        res.status(201).json(orderWithItems);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/orders 
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (user.roleID !== 2 && user.roleID !== 3) {
        return res.status(403).json({ error: 'Access denied. Manager required' });
    }

    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: { 
                        good: true 
                    }
                },
                user: {
                    select: { id: true, username: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// 3. GET /api/orders/my
router.get('/my', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;

    try {
        const orders = await prisma.order.findMany({
            where: { userId: user.id },
                include: {
                    items: {
                        include: { 
                            good: true 
                        }
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

// 4. PUT /api/orders/:id/status
router.put('/:id/status', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const orderId = parseInt(req.params.id as string);
    const { status } = req.body;

    if (user.roleID !== 2 && user.roleID !== 3) {
        return res.status(403).json({ error: 'Access denied. Manager required' });
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
                items: {
                    include: { good: true }
                },
                user: {
                    select: { id: true, username: true, email: true }
                }
            }
        });
        res.json(order);
    } catch (error: any) {
        if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
        }
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// DELETE /api/orders/:id/cancel
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
                error: 'Order not found or cannot be cancelled (already shipped/delivered)' 
            });
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'cancelled' }
        });

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

export default router;
