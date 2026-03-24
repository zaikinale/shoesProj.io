import { Request, Response } from 'express';
import { BasketService } from '../services/basket.service';

export class BasketController {
    static async getBasket(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const basket = await BasketService.getBasket(userId);
            res.json(basket || { items: [], total: 0 });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch basket' });
        }
    }

    static async addItem(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { goodId, quantity = 1 } = req.body;

            if (!goodId || quantity < 1) {
                return res.status(400).json({ error: 'Invalid goodId or quantity' });
            }

            const item = await BasketService.addItem(userId, goodId, quantity);
            res.status(201).json(item);
        } catch (error: any) {
            if (error.message === 'GOOD_NOT_AVAILABLE') {
                return res.status(400).json({ error: 'Товар недоступен' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateItem(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const itemId = parseInt(req.params.itemId as string);
            const { quantity } = req.body;

            const updated = await BasketService.updateItem(userId, itemId, quantity);
            res.json(updated);
        } catch (error: any) {
            const status = error.message === 'ITEM_NOT_FOUND' ? 404 : 400;
            res.status(status).json({ error: error.message });
        }
    }

    static async clear(req: Request, res: Response) {
        try {
            await BasketService.clearBasket((req as any).user.id);
            res.json({ message: 'Cleared' });
        } catch (error) {
            res.status(500).json({ error: 'Failed' });
        }
    }

    static async deleteItem(req: Request, res: Response) {
        try {
            await BasketService.deleteItem((req as any).user.id, parseInt(req.params.itemId as string));
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}