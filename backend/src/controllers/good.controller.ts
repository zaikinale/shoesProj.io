import { Request, Response } from 'express';
import { GoodService } from '../services/good.service';

const isAdmin = (user: any) => user && user.roleID === 3;

export class GoodController {
    static async getOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const user = (req as any).user;
            const good = await GoodService.getById(id, user?.id, isAdmin(user));

            if (!good) return res.status(404).json({ error: 'Good not found' });
            res.json(good);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const goods = await GoodService.getAll(user?.id, isAdmin(user));
            res.json(goods);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async create(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Forbidden' });
        try {
            const good = await GoodService.create(req.body);
            res.status(201).json(good);
        } catch (error) {
            res.status(500).json({ error: 'Create failed' });
        }
    }

    static async update(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Forbidden' });
        try {
            const id = parseInt(req.params.id as string);
            const { id: _id, createdAt, updatedAt, ...updateData } = req.body;

            const updated = await GoodService.update(id, updateData);
            res.json(updated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Update failed' });
        }
    }

    static async delete(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Forbidden' });
        try {
            await GoodService.softDelete(parseInt(req.params.id as string));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Delete failed' });
        }
    }
}
