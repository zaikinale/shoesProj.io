import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/goods 
router.get('/', async (req: Request, res: Response) => {
  try {
    const goods = await prisma.good.findMany();
    res.json(goods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goods' });
  }
});

// POST /api/goods 
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.roleID !== 3) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { title, description, price, image } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (typeof price !== 'number' || !Number.isInteger(price)) {
    return res.status(400).json({ error: 'Price must be an integer' });
  }

  try {
    const newGood = await prisma.good.create({
      data: {
        title,
        description: description || '',
        price,
        image: image || null
      }
    });
    return res.status(201).json(newGood);
  } catch (error: any) {
    console.error('Prisma error:', error.message);
    return res.status(500).json({ error: 'Failed to create good' });
  }
});

// PUT /api/goods/:id 
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.roleID !== 3) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const id = req.params.id as string;
  const { title, description, price, image } = req.body;

  try {
    const updatedGood = await prisma.good.update({
      where: { id: parseInt(id) },
      data: { title, description, price, image }
    });
    res.json(updatedGood);
  } catch (error) {
    res.status(404).json({ error: 'Good not found' });
  }
});

// DELETE /api/goods/:id 
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.roleID !== 3) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const id  = req.params.id as string;

  try {
    await prisma.good.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Good not found' });
  }
});

export default router;