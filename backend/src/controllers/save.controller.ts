import { Request, Response } from 'express';
import { SaveService } from '../services/save.service';

export class SaveController {
    static async getSaves(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const goods = await SaveService.getSavedGoods(userId);
            res.json(goods);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch saved goods' });
        }
    }

    static async check(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const goodId = parseInt(req.params.goodId as string);
            if (isNaN(goodId)) return res.status(400).json({ error: 'Invalid ID' });

            const isSaved = await SaveService.checkIsSaved(userId, goodId);
            res.json({ isSaved });
        } catch (error) {
            res.status(500).json({ error: 'Check failed' });
        }
    }

    static async save(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { goodId } = req.body;
            if (!goodId || typeof goodId !== 'number') {
                return res.status(400).json({ error: 'goodId is required' });
            }

            await SaveService.saveGood(userId, goodId);
            res.status(201).json({ message: 'Good saved' });
        } catch (error: any) {
            if (error.message === 'GOOD_NOT_FOUND') return res.status(404).json({ error: 'Good not found' });
            res.status(500).json({ error: 'Save failed' });
        }
    }

    static async remove(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const goodId = parseInt(req.params.goodId as string);
            if (isNaN(goodId)) return res.status(400).json({ error: 'Invalid ID' });

            await SaveService.removeGood(userId, goodId);
            res.json({ message: 'Removed from saved' });
        } catch (error: any) {
            if (error.message === 'NOT_SAVED') return res.status(404).json({ error: 'Not saved' });
            res.status(500).json({ error: 'Remove failed' });
        }
    }
}