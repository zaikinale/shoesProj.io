import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';

export class ReviewController {
    static async create(req: Request, res: Response) {
        const userId = (req as any).user.id;
        const { goodId, text, rating, image } = req.body;

        // Базовая валидация
        if (!goodId || typeof goodId !== 'number') return res.status(400).json({ error: 'Invalid goodId' });
        if (!text || typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: 'Text is required' });
        if (typeof rating !== 'number' || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating 1-5 required' });

        try {
            const review = await ReviewService.create(userId, { goodId, text, rating, image });
            res.status(201).json(review);
        } catch (error: any) {
            if (error.code === 'P2002') return res.status(409).json({ error: 'Already reviewed' });
            if (error.message === 'GOOD_NOT_FOUND') return res.status(404).json({ error: 'Good not found' });
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async check(req: Request, res: Response) {
        try {
            const goodId = parseInt(req.params.goodId as string);
            if (isNaN(goodId)) return res.status(400).json({ error: 'Invalid ID' });

            const hasReviewed = await ReviewService.checkExists((req as any).user.id, goodId);
            res.json({ hasReviewed });
        } catch (error) {
            res.status(500).json({ error: 'Error checking status' });
        }
    }

    static async getByGood(req: Request, res: Response) {
        try {
            const goodId = parseInt(req.params.goodId as string);
            if (isNaN(goodId)) return res.status(400).json({ error: 'Invalid ID' });

            const reviews = await ReviewService.getByGoodId(goodId);
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching reviews' });
        }
    }
}