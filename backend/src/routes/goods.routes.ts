
import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const isAdmin = (user: any) => user && user.roleID === 3;

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid good ID' });
    }

    try {
        const good = await prisma.good.findUnique({
            where: { id },
            include: { 
                categories: true,
                images: {
                    select: { id: true, url: true, isMain: true }
                }
            }
        });

        if (!good) {
            return res.status(404).json({ error: 'Good not found' });
        }

        if (!good.isActive && !isAdmin(user)) {
            return res.status(404).json({ error: 'Good not found' });
        }

        let responseGood: any = {
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

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userIsAdmin = isAdmin(user);

    try {
        const whereClause = userIsAdmin ? {} : { isActive: true };

        const goods = await prisma.good.findMany({
            where: whereClause,
            include: { 
                categories: true,
                images: {
                    select: { id: true, url: true, isMain: true },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!user) {
            return res.json(goods);
        }

        const basketItems = await prisma.basketItem.findMany({
            where: { basket: { userId: user.id } },
            select: { id: true, goodId: true }
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
    } catch (error: any) {
        console.error('Get goods list error:', error.message);
        res.status(500).json({ error: 'Failed to fetch goods' });
    }
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, price, image, isActive, categoryIds, images } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
    }
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Price must be positive number' });
    }

    try {
        const newGood = await prisma.good.create({
            data: {
                title: title.trim(),
                description: description?.trim() || '',
                price: Math.floor(price),
                image: image?.trim() || null,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            const validCategories = await prisma.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true }
            });
            const validIds = validCategories.map(c => c.id);

            if (validIds.length > 0) {
                await prisma.good.update({
                    where: { id: newGood.id },
                    data: {
                        categories: {
                            connect: validIds.map(id => ({ id }))
                        }
                    }
                });
            }
        }

        if (images && Array.isArray(images) && images.length > 0) {
            const validImages = images
                .filter((img: any) => img.url && typeof img.url === 'string')
                .map((img: any, index: number) => ({
                    goodId: newGood.id,
                    url: img.url.trim(),
                    isMain: img.isMain ?? index === 0 
                }));

            if (validImages.length > 0) {
                await prisma.productImage.createMany({
                    data: validImages.map((img, i) => ({
                        ...img,
                        isMain: i === 0
                    }))
                });
            }
        }

        const goodWithAll = await prisma.good.findUnique({
            where: { id: newGood.id },
            include: { 
                categories: true,
                images: {
                    select: { id: true, url: true, isMain: true }
                }
            }
        });

        res.status(201).json(goodWithAll);
    } catch (error: any) {
        console.error('Create good error:', error.message);
        res.status(500).json({ error: 'Failed to create good' });
    }
});

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const id = parseInt(req.params.id as string);
    const { title, description, price, image, isActive, categoryIds, images } = req.body;

    try {
        const existing = await prisma.good.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Good not found' });
        }

        const updatedData: any = {};

        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({ error: 'Invalid title' });
            }
            updatedData.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== 'string') {
                return res.status(400).json({ error: 'Invalid description' });
            }
            updatedData.description = description;
        }

        if (price !== undefined) {
            if (typeof price !== 'number' || price <= 0) {
                return res.status(400).json({ error: 'Invalid price' });
            }
            updatedData.price = Math.floor(price);
        }

        if (image !== undefined) {
            updatedData.image = image?.trim() || null;
        }

        if (isActive !== undefined) {
            if (typeof isActive !== 'boolean') {
                return res.status(400).json({ error: 'isActive must be boolean' });
            }
            updatedData.isActive = isActive;
        }

        if (Object.keys(updatedData).length > 0) {
            await prisma.good.update({
                where: { id },
                data: updatedData
            });
        }

        if (categoryIds !== undefined && Array.isArray(categoryIds)) {
            const validCategories = await prisma.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true }
            });
            const validIds = validCategories.map(c => c.id);

            await prisma.good.update({
                where: { id },
                data: {
                    categories: {
                        set: validIds.map(cid => ({ id: cid }))
                    }
                }
            });
        }

        if (images !== undefined && Array.isArray(images)) {
            await prisma.productImage.deleteMany({ where: { goodId: id } });
            
            if (images.length > 0) {
                const validImages = images
                    .filter((img: any) => img.url && typeof img.url === 'string')
                    .map((img: any, index: number) => ({
                        goodId: id,
                        url: img.url.trim(),
                        isMain: img.isMain ?? index === 0
                    }));

                if (validImages.length > 0) {
                    await prisma.productImage.createMany({
                        data: validImages.map((img, i) => ({
                            ...img,
                            isMain: i === 0
                        }))
                    });
                }
            }
        }

        const updatedGood = await prisma.good.findUnique({
            where: { id },
            include: { 
                categories: true,
                images: {
                    select: { id: true, url: true, isMain: true }
                }
            }
        });

        res.json(updatedGood);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Good not found' });
        }
        console.error('Update good error:', error.message);
        res.status(500).json({ error: 'Failed to update good' });
    }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const id = parseInt(req.params.id as string);

    try {
        await prisma.good.update({
            where: { id },
            data: { isActive: false }
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Good not found' });
        }
        console.error('Soft delete good error:', error.message);
        res.status(500).json({ error: 'Failed to deactivate good' });
    }
});

router.post('/:id/images', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const goodId = parseInt(req.params.id as string);
    const { url, isMain } = req.body;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
        const good = await prisma.good.findUnique({ where: { id: goodId } });
        if (!good) {
            return res.status(404).json({ error: 'Good not found' });
        }

        if (isMain) {
            await prisma.productImage.updateMany({
                where: { goodId },
                data: { isMain: false }
            });
        }

        const newImage = await prisma.productImage.create({
            data: {
                goodId,
                url: url.trim(),
                isMain: isMain ?? false
            }
        });

        res.status(201).json(newImage);
    } catch (error: any) {
        console.error('Add image error:', error.message);
        res.status(500).json({ error: 'Failed to add image' });
    }
});

router.delete('/:id/images/:imageId', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const imageId = parseInt(req.params.imageId as string);

    try {
        await prisma.productImage.delete({ where: { id: imageId } });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Image not found' });
        }
        console.error('Delete image error:', error.message);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

router.put('/:id/images/:imageId', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const imageId = parseInt(req.params.imageId as string);
    const { isMain } = req.body;

    try {
        const updateData: any = {};
        
        if (isMain !== undefined) {
            updateData.isMain = isMain;
            
            if (isMain) {
                const image = await prisma.productImage.findUnique({
                    where: { id: imageId },
                    select: { goodId: true }
                });
                
                if (image) {
                    await prisma.productImage.updateMany({
                        where: { goodId: image.goodId, id: { not: imageId } },
                        data: { isMain: false }
                    });
                }
            }
        }

        const updated = await prisma.productImage.update({
            where: { id: imageId },
            data: updateData
        });

        res.json(updated);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Image not found' });
        }
        console.error('Update image error:', error.message);
        res.status(500).json({ error: 'Failed to update image' });
    }
});

export default router;