import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/goods/:id
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const id = parseInt(req.params.id as string);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid good ID' });
  }

  try {
    const good = await prisma.good.findUnique({
      where: { id }
    });

    if (!good) {
      return res.status(404).json({ error: 'Good not found' });
    }

    let responseGood = {
      ...good,
      isInBasket: false,
      basketItemId: null as number | null,
    };

    if (user) {
      const basketItem = await prisma.basketItem.findFirst({
        where: { 
          basket: { userId: user.id },
          goodId: id
        },
        select: { id: true }
      });

      responseGood = {
        ...good,
        isInBasket: !!basketItem,
        basketItemId: basketItem?.id ?? null,
      };
    }

    res.json(responseGood);
  } catch (error: any) {
    console.error('Get good by ID error:', error.message);
    res.status(500).json({ error: 'Failed to fetch good' });
  }
});

// GET /api/goods
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const goods = await prisma.good.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (!user) {
      return res.json(goods);
    }

    const basketItems = await prisma.basketItem.findMany({
      where: { 
        basket: { userId: user.id } 
      },
      select: { 
        id: true, 
        goodId: true 
      }
    });

    const basketItemMap = new Map(
      basketItems.map((item: { goodId: any; id: any; }) => [item.goodId, item.id])
    );

    const goodsWithBasket = goods.map((good: { id: unknown; }) => ({
      ...good,
      isInBasket: basketItemMap.has(good.id),
      basketItemId: basketItemMap.get(good.id) || null 
    }));

    res.json(goodsWithBasket);
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
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be positive number' });
  }

  try {
    const newGood = await prisma.good.create({
      data: {
        title,
        description: description || '',
        price: Math.floor(price),
        image: image || null
      }
    });
    res.status(201).json(newGood);
  } catch (error: any) {
    console.error('Create good error:', error.message);
    res.status(500).json({ error: 'Failed to create good' });
  }
});

// PUT /api/goods/:id
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.roleID !== 3) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const id = parseInt(req.params.id as string);
  const { title, description, price, image } = req.body;

  try {
    const updatedGood = await prisma.good.update({
      where: { id },
      data: { 
        title,
        description: description || '',
        price: Math.floor(price),
        image: image || null 
      }
    });
    res.json(updatedGood);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Good not found' });
    }
    res.status(500).json({ error: 'Failed to update good' });
  }
});

// DELETE /api/goods/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.roleID !== 3) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const id = parseInt(req.params.id as string);

  try {
    await prisma.good.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Good not found' });
    }
    res.status(500).json({ error: 'Failed to delete good' });
  }
});

export default router;
