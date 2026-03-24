import { Request, Response } from 'express';
import { CategoryService } from '../services/categories.service';

const isAdmin = (user: any) => user && user.roleID === 3;

export class CategoryController {
    static async getAll(req: Request, res: Response) {
        try {
            const categories = await CategoryService.getAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
            
            const category = await CategoryService.getById(id);
            if (!category) return res.status(404).json({ error: 'Not found' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: 'Error' });
        }
    }

    static async create(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Forbidden' });
        try {
            const { name, description } = req.body;
            const category = await CategoryService.create(name, description);
            res.status(201).json(category);
        } catch (error: any) {
            if (error.code === 'P2002') return res.status(400).json({ error: 'Exists' });
            res.status(500).json({ error: 'Failed' });
        }
    }

    static async update(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Forbidden' });
        try {
            const id = parseInt(req.params.id as string);
            const { description } = req.body;
            const updated = await CategoryService.update(id, description);
            res.json(updated);
        } catch (error: any) {
            res.status(error.code === 'P2025' ? 404 : 500).json({ error: 'Update failed' });
        }
    }

    static async delete(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Forbidden' });
        try {
            await CategoryService.delete(parseInt(req.params.id as string));
            res.status(204).send();
        } catch (error: any) {
            res.status(error.code === 'P2025' ? 404 : 500).json({ error: 'Delete failed' });
        }
    }

    static async addGood(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Forbidden' });
        try {
            const categoryId = parseInt(req.params.id as string);
            const { goodId } = req.body;
            const result = await CategoryService.addGoodToCategory(categoryId, goodId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to connect' });
        }
    }

    static async removeGood(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Forbidden' });
        try {
            const categoryId = parseInt(req.params.id as string);
            const goodId = parseInt(req.params.goodId as string);
            await CategoryService.removeGoodFromCategory(categoryId, goodId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to disconnect' });
        }
    }

    static async getGoods(req: Request, res: Response) {
        try {
            const goods = await CategoryService.getGoodsByCategoryId(parseInt(req.params.id as string));
            res.json(goods);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch goods' });
        }
    }

    static async getByGood(req: Request, res: Response) {
        try {
            const categories = await CategoryService.getCategoriesByGoodId(parseInt(req.params.goodId as string));
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Error' });
        }
    }
}