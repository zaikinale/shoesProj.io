// import { Router, Request, Response } from 'express';
// import { prisma } from '../utils/prismaClient';
// import { authenticateToken } from '../middleware/auth';

// const router = Router();

// const isAdmin = (user: any) => user && user.roleID === 3;

// // GET /api/goods/:id
// router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
//     const user = (req as any).user;
//     const id = parseInt(req.params.id as string);

//     if (isNaN(id)) {
//         return res.status(400).json({ error: 'Invalid good ID' });
//     }

//     try {
//         const good = await prisma.good.findUnique({
//             where: { id }
//         });

//         if (!good) {
//             return res.status(404).json({ error: 'Good not found' });
//         }

//         // @ts-ignore
//         if (!good.isActive && !isAdmin(user)) {
//             return res.status(404).json({ error: 'Good not found' });
//         }

//         let responseGood = {
//             ...good,
//             isInBasket: false,
//             basketItemId: null as number | null,
//         };

//         if (user) {
//             const basketItem = await prisma.basketItem.findFirst({
//                 where: {
//                     basket: { userId: user.id },
//                     goodId: id
//                 },
//                 select: { id: true }
//             });

//             responseGood = {
//                 ...good,
//                 isInBasket: !!basketItem,
//                 basketItemId: basketItem?.id ?? null,
//             };
//         }

//         res.json(responseGood);
//     } catch (error: any) {
//         console.error('Get good by ID error:', error.message);
//         res.status(500).json({ error: 'Failed to fetch good' });
//     }
// });

// // GET /api/goods
// router.get('/', authenticateToken, async (req: Request, res: Response) => {
//     const user = (req as any).user;
//     const userIsAdmin = isAdmin(user);

//     try {
//         const whereClause = userIsAdmin
//             ? {}
//             : { isActive: true };

//         const goods = await prisma.good.findMany({
//             // @ts-ignore
//             where: whereClause,
//             orderBy: { createdAt: 'desc' }
//         });

//         if (!user) {
//             return res.json(goods);
//         }

//         const basketItems = await prisma.basketItem.findMany({
//             where: {
//                 basket: { userId: user.id }
//             },
//             select: {
//                 id: true,
//                 goodId: true
//             }
//         });

//         const basketItemMap = new Map(
//             basketItems.map((item: { goodId: any; id: any; }) => [item.goodId, item.id])
//         );

//         const goodsWithBasket = goods.map((good: { id: unknown; }) => ({
//             ...good,
//             isInBasket: basketItemMap.has(good.id),
//             basketItemId: basketItemMap.get(good.id) || null
//         }));

//         res.json(goodsWithBasket);
//     } catch (error: any) {
//         console.error('Get goods list error:', error.message);
//         res.status(500).json({ error: 'Failed to fetch goods' });
//     }
// });

// // POST /api/goods
// router.post('/', authenticateToken, async (req: Request, res: Response) => {
//     const user = (req as any).user;
//     if (!isAdmin(user)) {
//         return res.status(403).json({ error: 'Access denied' });
//     }

//     const { title, description, price, image } = req.body;

//     if (!title || typeof title !== 'string') {
//         return res.status(400).json({ error: 'Title is required' });
//     }
//     if (typeof price !== 'number' || price <= 0) {
//         return res.status(400).json({ error: 'Price must be positive number' });
//     }

//     try {
//         const newGood = await prisma.good.create({
//             data: {
//                 title,
//                 description: description || '',
//                 price: Math.floor(price),
//                 image: image || null,
//                 // @ts-ignore
//                 isActive: true
//             }
//         });
//         res.status(201).json(newGood);
//     } catch (error: any) {
//         console.error('Create good error:', error.message);
//         res.status(500).json({ error: 'Failed to create good' });
//     }
// });

// // PUT /api/goods/:id
// // PUT /api/goods/:id — исправленная версия
// router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
//     const user = (req as any).user;
//     if (!isAdmin(user)) {
//         return res.status(403).json({ error: 'Access denied' });
//     }

//     const id = parseInt(req.params.id as string);
//     const { title, description, price, image, isActive, categoryIds } = req.body;

//     try {
//         // 🔹 Формируем объект обновления ТОЛЬКО с переданными полями
//         const updatedData: any = {};

//         if (title !== undefined) {
//             if (typeof title !== 'string' || !title.trim()) {
//                 return res.status(400).json({ error: 'Invalid title' });
//             }
//             updatedData.title = title.trim();
//         }

//         if (description !== undefined) {
//             if (typeof description !== 'string') {
//                 return res.status(400).json({ error: 'Invalid description' });
//             }
//             updatedData.description = description; // ✅ Не используем || ''
//         }

//         if (price !== undefined) {
//             if (typeof price !== 'number' || price <= 0) {
//                 return res.status(400).json({ error: 'Invalid price' });
//             }
//             updatedData.price = Math.floor(price);
//         }

//         if (image !== undefined) {
//             updatedData.image = image?.trim() || null;
//         }

//         if (isActive !== undefined) {
//             if (typeof isActive !== 'boolean') {
//                 return res.status(400).json({ error: 'isActive must be boolean' });
//             }
//             updatedData.isActive = isActive;
//         }

//         // Проверяем, что есть что обновлять
//         if (Object.keys(updatedData).length === 0) {
//             return res.status(400).json({ error: 'No valid fields to update' });
//         }

//         const updatedGood = await prisma.good.update({
//             where: { id },
//             data: updatedData
//         });

//         res.json(updatedGood);
//     } catch (error: any) {
//         if (error.code === 'P2025') {
//             return res.status(404).json({ error: 'Good not found' });
//         }
//         console.error('Update good error:', error.message);
//         res.status(500).json({ error: 'Failed to update good' });
//     }
// });
// // router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
// //     const user = (req as any).user;
// //     if (!isAdmin(user)) {
// //         return res.status(403).json({ error: 'Access denied' });
// //     }

// //     const id = parseInt(req.params.id as string);
// //     const { title, description, price, image, isActive } = req.body;

// //     try {
// //         const updatedData: any = {
// //             title,
// //             description: description || '',
// //             price: typeof price === 'number' ? Math.floor(price) : undefined,
// //             image: image !== undefined ? image : undefined,
// //         };

// //         if (typeof isActive === 'boolean') {
// //             updatedData.isActive = isActive;
// //         }

// //         const updatedGood = await prisma.good.update({
// //             where: { id },
// //             data: updatedData
// //         });
// //         res.json(updatedGood);
// //     } catch (error: any) {
// //         if (error.code === 'P2025') {
// //             return res.status(404).json({ error: 'Good not found' });
// //         }
// //         console.error('Update good error:', error.message);
// //         res.status(500).json({ error: 'Failed to update good' });
// //     }
// // });

// // DELETE /api/goods/:id
// router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
//     const user = (req as any).user;
//     if (!isAdmin(user)) {
//         return res.status(403).json({ error: 'Access denied' });
//     }

//     const id = parseInt(req.params.id as string);

//     try {
//         // @ts-ignore
//         await prisma.good.update({
//             where: { id },
//             data: {
//                 isActive: false
//             }
//         });

//         res.status(204).send();
//     } catch (error: any) {
//         if (error.code === 'P2025') {
//             return res.status(404).json({ error: 'Good not found' });
//         }
//         console.error('Soft delete good error:', error.message);
//         res.status(500).json({ error: 'Failed to deactivate good' });
//     }
// });

// export default router;

// routes/goods.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const isAdmin = (user: any) => user && user.roleID === 3;

// ==================== GET /api/goods/:id ====================
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid good ID' });
    }

    try {
        // 🔹 Запрашиваем товар с категориями
        const good = await prisma.good.findUnique({
            where: { id },
            include: { categories: true }
        });

        if (!good) {
            return res.status(404).json({ error: 'Good not found' });
        }

        // Неактивные товары видны только админам
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

// ==================== GET /api/goods ====================
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userIsAdmin = isAdmin(user);

    try {
        const whereClause = userIsAdmin ? {} : { isActive: true };

        // 🔹 Запрашиваем товары с категориями
        const goods = await prisma.good.findMany({
            where: whereClause,
            include: { categories: true },
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

// ==================== POST /api/goods ====================
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, price, image, isActive, categoryIds } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
    }
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Price must be positive number' });
    }

    try {
        // 🔹 1. Создаём товар
        const newGood = await prisma.good.create({
            data: {
                title: title.trim(),
                description: description?.trim() || '',
                price: Math.floor(price),
                image: image?.trim() || null,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        // 🔹 2. Если переданы категории — привязываем их
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

        // 🔹 3. Возвращаем товар с категориями
        const goodWithCategories = await prisma.good.findUnique({
            where: { id: newGood.id },
            include: { categories: true }
        });

        res.status(201).json(goodWithCategories);
    } catch (error: any) {
        console.error('Create good error:', error.message);
        res.status(500).json({ error: 'Failed to create good' });
    }
});

// ==================== PUT /api/goods/:id ====================
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const id = parseInt(req.params.id as string);
    const { title, description, price, image, isActive, categoryIds } = req.body;

    try {
        // 🔹 1. Проверяем существование товара
        const existing = await prisma.good.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Good not found' });
        }

        // 🔹 2. Формируем объект обновления ТОЛЬКО с переданными полями
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
            updatedData.description = description; // ✅ Без || '' — не затираем пустым
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

        // 🔹 3. Обновляем основные поля товара (если есть что обновлять)
        if (Object.keys(updatedData).length > 0) {
            await prisma.good.update({
                where: { id },
                data: updatedData
            });
        }

        // 🔹 4. Если переданы категории — обновляем связь (полная замена)
        if (categoryIds !== undefined && Array.isArray(categoryIds)) {
            const validCategories = await prisma.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true }
            });
            const validIds = validCategories.map(c => c.id);

            // set: сначала отвяжет всё, потом привяжет новое
            await prisma.good.update({
                where: { id },
                data: {
                    categories: {
                        set: validIds.map(cid => ({ id: cid }))
                    }
                }
            });
        }

        // 🔹 5. Возвращаем обновлённый товар с категориями
        const updatedGood = await prisma.good.findUnique({
            where: { id },
            include: { categories: true }
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

// ==================== DELETE /api/goods/:id ====================
// Мягкое удаление: просто ставим isActive = false
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

export default router;