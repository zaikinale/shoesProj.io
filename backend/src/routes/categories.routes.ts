// routes/categories.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const isAdmin = (user: any) => user && user.roleID === 3;

// GET /api/categories — список всех категорий
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { goods: true } } },
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error: any) {
        console.error('Get categories error:', error.message);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET /api/categories/:id — категория + товары в ней
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid category ID' });

    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                goods: {
                    where: { isActive: true },
                    select: { id: true, title: true, price: true, image: true }
                }
            }
        });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (error: any) {
        console.error('Get category error:', error.message);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

// POST /api/categories — создать (только админ)\
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    const { name, description } = req.body;
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const category = await prisma.category.create({
            data: {
                name,
                description: description || null
            }
        });
        res.status(201).json(category);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Category already exists' });
        }
        console.error('Create category error:', error.message);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// PUT /api/categories/:id — обновить описание (только админ)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    const id = parseInt(req.params.id as string);
    const { description } = req.body;

    try {
        const updated = await prisma.category.update({
            where: { id },
            data: { description: description ?? undefined }
        });
        res.json(updated);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        }
        console.error('Update category error:', error.message);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// DELETE /api/categories/:id — удалить (только админ)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    const id = parseInt(req.params.id as string);
    try {
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        }
        console.error('Delete category error:', error.message);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// POST /api/categories/:id/goods — добавить товар в категорию
router.post('/:id/goods', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });
    
    const id = parseInt(req.params.id as string);
    const categoryId = parseInt(req.params.id as string);
    const { goodId } = req.body;
    
    if (!goodId || isNaN(categoryId)) {
        return res.status(400).json({ error: 'goodId and categoryId are required' });
    }

    try {
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: {
                goods: {
                    connect: { id: goodId }
                }
            },
            include: { goods: true }
        });
        res.json(category);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category or Good not found' });
        }
        console.error('Add good to category error:', error.message);
        res.status(500).json({ error: 'Failed to add good to category' });
    }
});

// DELETE /api/categories/:id/goods/:goodId — убрать товар из категории
router.delete('/:id/goods/:goodId', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    const categoryId = parseInt(req.params.id as string);
    const goodId = parseInt(req.params.goodId as string);

    try {
        await prisma.category.update({
            where: { id: categoryId },
            data: {
                goods: {
                    disconnect: { id: goodId }
                }
            }
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Relation not found' });
        }
        console.error('Remove good from category error:', error.message);
        res.status(500).json({ error: 'Failed to remove good from category' });
    }
});

// GET /api/categories/:id/goods — товары конкретной категории
router.get('/:id/goods', authenticateToken, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid category ID' });

    try {
        const goods = await prisma.good.findMany({
            where: {
                categories: { some: { id } },
                isActive: true
            },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                image: true,
                createdAt: true
            }
        });
        res.json(goods);
    } catch (error: any) {
        console.error('Get goods by category error:', error.message);
        res.status(500).json({ error: 'Failed to fetch goods' });
    }
});

export default router;