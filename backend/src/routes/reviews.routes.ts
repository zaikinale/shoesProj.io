import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/reviews
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { goodId, text, rating, image } = req.body;

  // Валидация входных данных
    if (!goodId || typeof goodId !== 'number') {
        return res.status(400).json({ error: 'goodId (number) is required' });
    }
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'text (non-empty string) is required' });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'rating must be integer from 1 to 5' });
    }

    try {
        const good = await prisma.good.findUnique({ where: { id: goodId } });
        if (!good) {
            return res.status(404).json({ error: 'Good not found' });
        }

        const review = await prisma.review.create({
            data: {
                userId: user.id,
                goodId,
                text: text.trim(),
                rating: Math.round(rating),
                image: image || null
            }
        });

        res.status(201).json(review);
    } catch (error: any) {
        if (error.code === 'P2002') { 
            return res.status(409).json({ error: 'You already reviewed this good' });
        }
        console.error('Create review error:', error.message);
        res.status(500).json({ error: 'Failed to create review' });
    }
});
// GET /api/reviews/:goodId 
router.get('/:goodId', async (req: Request, res: Response) => {
    const goodId = parseInt(req.params.goodId as string, 10);

    if (isNaN(goodId)) {
        return res.status(400).json({ error: 'Invalid good ID' });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { goodId },
            include: {
                user: {
                    select: { username: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reviews);
    } catch (error: any) {
        console.error('Get reviews error:', error.message);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

export default router;




