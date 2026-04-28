import { prisma } from '../utils/prismaClient';

export class GoodService {
    static async getById(id: number, userId?: number, isAdmin: boolean = false) {
        const good = await prisma.good.findUnique({
            where: { id },
            include: {
                categories: true,
                images: { select: { id: true, url: true, isMain: true } },
            },
        });

        if (!good || (!good.isActive && !isAdmin)) return null;

        let isInBasket = false;
        let basketItemId = null;

        if (userId) {
            const basketItem = await prisma.basketItem.findFirst({
                where: { basket: { userId }, goodId: id },
                select: { id: true },
            });
            isInBasket = !!basketItem;
            basketItemId = basketItem?.id ?? null;
        }

        return { ...good, isInBasket, basketItemId };
    }

    // static async getAll(userId?: number, isAdmin: boolean = false) {
    //     const goods = await prisma.good.findMany({
    //         where: isAdmin ? {} : { isActive: true },
    //         include: {
    //             categories: true,
    //             images: { select: { id: true, url: true, isMain: true }, take: 1 },
    //         },
    //         orderBy: { createdAt: 'desc' },
    //     });

    //     if (!userId) return goods.map((g) => ({ ...g, isInBasket: false, basketItemId: null }));

    //     const basketItems = await prisma.basketItem.findMany({
    //         where: { basket: { userId } },
    //         select: { id: true, goodId: true },
    //     });

    //     const basketMap = new Map(basketItems.map((i) => [i.goodId, i.id]));

    //     return goods.map((good) => ({
    //         ...good,
    //         isInBasket: basketMap.has(good.id),
    //         basketItemId: basketMap.get(good.id) || null,
    //     }));
    // }
    static async getAll(userId?: number, isAdmin: boolean = false) {
    // 1. Основной запрос товаров
    const goods = await prisma.good.findMany({
        where: isAdmin ? {} : { isActive: true },
        include: {
            categories: true,
            images: { select: { id: true, url: true, isMain: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
    });

    // Если юзер не авторизован, возвращаем товары с дефолтными флагами
    if (!userId) {
        return goods.map((g) => ({ 
            ...g, 
            isInBasket: false, 
            basketItemId: null, 
            isSaved: false 
        }));
    }

    // 2. Параллельно получаем данные о корзине и сохранениях юзера
    const [basketItems, userSaves] = await Promise.all([
        prisma.basketItem.findMany({
            where: { basket: { userId } },
            select: { id: true, goodId: true },
        }),
        prisma.save.findMany({
            where: { userId },
            select: { goodId: true }
        })
    ]);

    // 3. Создаем структуры данных для O(1) поиска
    const basketMap = new Map(basketItems.map((i) => [i.goodId, i.id]));
    const savedIdsSet = new Set(userSaves.map((s) => s.goodId));

    // 4. Собираем итоговый массив
    return goods.map((good) => ({
        ...good,
        isInBasket: basketMap.has(good.id),
        basketItemId: basketMap.get(good.id) || null,
        isSaved: savedIdsSet.has(good.id)
    }));
    }

    static async create(data: any) {
        const { title, description, price, image, isActive, categoryIds, images } = data;

        return prisma.$transaction(async (tx) => {
            const newGood = await tx.good.create({
                data: {
                    title: title.trim(),
                    description: description?.trim() || '',
                    price: Math.floor(price),
                    image: image?.trim() || null,
                    isActive: isActive ?? true,
                    categories: categoryIds
                        ? { connect: categoryIds.map((id: number) => ({ id })) }
                        : undefined,
                },
            });

            if (images && Array.isArray(images)) {
                await tx.productImage.createMany({
                    data: images.map((img: any, i: number) => ({
                        goodId: newGood.id,
                        url: img.url.trim(),
                        isMain: i === 0,
                    })),
                });
            }

            return tx.good.findUnique({
                where: { id: newGood.id },
                include: { categories: true, images: true },
            });
        });
    }

    static async update(id: number, data: any) {
        const { title, description, price, image, isActive, categoryIds, images } = data;

        return prisma.$transaction(async (tx) => {
            await tx.good.update({
                where: { id: Number(id) },
                data: {
                    title: title?.trim(),
                    description: description?.trim() || '',
                    price: price !== undefined ? Math.floor(Number(price)) : undefined,
                    image: image?.trim() || null,
                    isActive: isActive ?? true,
                    categories: categoryIds
                        ? { set: categoryIds.map((cid: number) => ({ id: cid })) }
                        : undefined,
                },
            });

            if (images !== undefined) {
                await tx.productImage.deleteMany({ where: { goodId: id } });
                if (images.length > 0) {
                    await tx.productImage.createMany({
                        data: images.map((img: any, i: number) => ({
                            goodId: id,
                            url: img.url.trim(),
                            isMain: img.isMain ?? i === 0,
                        })),
                    });
                }
            }

            return tx.good.findUnique({
                where: { id },
                include: { categories: true, images: true },
            });
        });
    }

    static async softDelete(id: number) {
        return prisma.good.update({ where: { id }, data: { isActive: false } });
    }
}
