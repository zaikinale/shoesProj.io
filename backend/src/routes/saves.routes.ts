

import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/saves 
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;

    try {
        const saves = await prisma.save.findMany({
            where: { userId: user.id },
            include: { good: true }
        });

        const goods = saves.map((save: { good: any; }) => save.good);
        res.json(goods);
    } catch (error: any) {
        console.error('Get saves error:', error.message);
        res.status(500).json({ error: 'Failed to fetch saved goods' });
    }
});

// GET /api/saves/check/:goodId 
router.get('/check/:goodId', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const goodId = parseInt(req.params.goodId as string, 10);

    if (isNaN(goodId)) {
        return res.status(400).json({ error: 'Invalid good ID' });
    }

    try {
        const exists = await prisma.save.findFirst({
            where: { userId: user.id, goodId }
        });

        res.json({ isSaved: !!exists });
    } catch (error: any) {
        console.error('Check save error:', error.message);
        res.status(500).json({ error: 'Failed to check save status' });
    }
});

// POST /api/saves 
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { goodId } = req.body;

    if (!goodId || typeof goodId !== 'number') {
        return res.status(400).json({ error: 'goodId (number) is required' });
    }

    try {
        const good = await prisma.good.findUnique({ where: { id: goodId } });
        if (!good) {
            return res.status(404).json({ error: 'Good not found' });
        }

        await prisma.save.upsert({
            where: { userId_goodId: { userId: user.id, goodId } },
            create: { userId: user.id, goodId },
            update: {}
        });

        res.status(201).json({ message: 'Good saved' });
    } catch (error: any) {
        console.error('Save good error:', error.message);
        res.status(500).json({ error: 'Failed to save good' });
    }
});

// DELETE /api/saves/:goodId 
router.delete('/:goodId', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const goodId = parseInt(req.params.goodId as string, 10);

    if (isNaN(goodId)) {
        return res.status(400).json({ error: 'Invalid good ID' });
    }

    try {
        const deleted = await prisma.save.deleteMany({
            where: { userId: user.id, goodId }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ error: 'Not saved' });
        }

        res.status(200).json({ message: 'Removed from saved' });
    } catch (error: any) {
        console.error('Delete save error:', error.message);
        res.status(500).json({ error: 'Failed to remove from saved' });
    }
});

export default router;




