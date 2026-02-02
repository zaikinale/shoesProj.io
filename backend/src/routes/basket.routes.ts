import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';
const router = Router();

// GET /api/basket 
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        const basket = await prisma.basket.findUnique({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        good: true
                    }
                }
            }
        });
        if (!basket) {
            return res.json({ items: [], total: 0 });
        }
    res.json(basket);
    } catch (error) {
        console.error('Basket fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch basket' });
    }
});

// DELETE /api/basket/clear 
router.delete('/clear', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        await prisma.basketItem.deleteMany({
            where: { basket: { userId: user.id } }
        });
        res.json({ message: 'Basket cleared successfully' });
    } catch (error) {
        console.error('Basket clear error:', error);
        res.status(500).json({ error: 'Failed to clear basket' });
    }
});

// POST /api/basket/add-good
router.post('/add-good', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { goodId, quantity = 1 } = req.body;

    if (!goodId || typeof goodId !== 'number' || goodId <= 0) {
        return res.status(400).json({ error: 'goodId must be a positive number' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: 'quantity must be positive integer' });
    }

    try {
        let basket = await prisma.basket.findUnique({ where: { userId: user.id } });
        if (!basket) {
            basket = await prisma.basket.create({
                data: { userId: user.id }
            });
        }

        let item = await prisma.basketItem.findUnique({
            where: { basketId_goodId: { basketId: basket.id, goodId } }
        });

        if (item) {
            item = await prisma.basketItem.update({
                where: { id: item.id },
                data: { quantity: item.quantity + quantity }
            });
        } else {
            item = await prisma.basketItem.create({
                data: {
                    basketId: basket.id,
                    goodId,
                    quantity
                }
            });
        }

        const itemWithGood = await prisma.basketItem.findUnique({
            where: { id: item.id },
            include: { good: true }
        });
        res.status(201).json(itemWithGood);
    } catch (error: any) {
        console.error('Add to basket error:', error.message);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Good not found' });
        }
        res.status(500).json({ error: 'Failed to add good to basket' });
    }
});

// PUT /api/basket/update-good/:itemId
router.put('/update-good/:itemId', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const itemId = req.params.itemId as string;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: 'quantity must be non-negative integer' });
    }

    try {
        const item = await prisma.basketItem.findFirst({
            where: {
                id: parseInt(itemId),
                basket: { userId: user.id }
            },
        include: { good: true }
        });

        if (!item) {
            return res.status(404).json({ error: 'Basket item not found' });
        }

        const updatedItem = await prisma.basketItem.update({
            where: { id: item.id },
            data: { quantity }
        });
        res.json(updatedItem);
    } catch (error) {
        console.error('Update basket item error:', error);
        res.status(500).json({ error: 'Failed to update basket item' });
    }
});

// DELETE /api/basket/delete-good/:itemId 
router.delete('/delete-good/:itemId', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const itemId = req.params.itemId as string;
    try {
        const item = await prisma.basketItem.findFirst({
            where: {
                id: parseInt(itemId),
                basket: { userId: user.id }
            }
        });

        if (!item) {
            return res.status(404).json({ error: 'Basket item not found' });
        }

        await prisma.basketItem.delete({ where: { id: item.id } });
        res.status(204).send();
    } catch (error) {
        console.error('Delete basket item error:', error);
        res.status(500).json({ error: 'Failed to delete basket item' });
    }
});

export default router;
