import { prisma } from '../utils/prismaClient';

export class GoodService {
    static async getById(id: number, userId?: number, isAdmin: boolean = false) {
        const good = await prisma.good.findUnique({
            where: { id },
            include: { 
                categories: true,
                images: { select: { id: true, url: true, isMain: true } }
            }
        });

        if (!good || (!good.isActive && !isAdmin)) return null;

        let isInBasket = false;
        let basketItemId = null;

        if (userId) {
            const basketItem = await prisma.basketItem.findFirst({
                where: { basket: { userId }, goodId: id },
                select: { id: true }
            });
            isInBasket = !!basketItem;
            basketItemId = basketItem?.id ?? null;
        }

        return { ...good, isInBasket, basketItemId };
    }

    static async getAll(userId?: number, isAdmin: boolean = false) {
        const goods = await prisma.good.findMany({
            where: isAdmin ? {} : { isActive: true },
            include: { 
                categories: true,
                images: { select: { id: true, url: true, isMain: true }, take: 1 }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!userId) return goods.map(g => ({ ...g, isInBasket: false, basketItemId: null }));

        const basketItems = await prisma.basketItem.findMany({
            where: { basket: { userId } },
            select: { id: true, goodId: true }
        });

        const basketMap = new Map(basketItems.map(i => [i.goodId, i.id]));

        return goods.map(good => ({
            ...good,
            isInBasket: basketMap.has(good.id),
            basketItemId: basketMap.get(good.id) || null
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
                    categories: categoryIds ? { connect: categoryIds.map((id: number) => ({ id })) } : undefined
                }
            });

            if (images && Array.isArray(images)) {
                await tx.productImage.createMany({
                    data: images.map((img: any, i: number) => ({
                        goodId: newGood.id,
                        url: img.url.trim(),
                        isMain: i === 0
                    }))
                });
            }

            return tx.good.findUnique({
                where: { id: newGood.id },
                include: { categories: true, images: true }
            });
        });
    }

    static async update(id: number, data: any) {
        const { categoryIds, images, ...rest } = data;
        
        return prisma.$transaction(async (tx) => {
            await tx.good.update({
                where: { id },
                data: {
                    ...rest,
                    categories: categoryIds ? { set: categoryIds.map((id: number) => ({ id })) } : undefined
                }
            });

            if (images !== undefined) {
                await tx.productImage.deleteMany({ where: { goodId: id } });
                await tx.productImage.createMany({
                    data: images.map((img: any, i: number) => ({
                        goodId: id,
                        url: img.url.trim(),
                        isMain: i === 0
                    }))
                });
            }

            return tx.good.findUnique({
                where: { id },
                include: { categories: true, images: true }
            });
        });
    }

    static async softDelete(id: number) {
        return prisma.good.update({ where: { id }, data: { isActive: false } });
    }
}