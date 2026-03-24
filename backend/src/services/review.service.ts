import { prisma } from '../utils/prismaClient';

export class ReviewService {
    static async create(userId: number, data: { goodId: number, text: string, rating: number, image?: string }) {
        const { goodId, text, rating, image } = data;

        // Проверяем существование товара
        const good = await prisma.good.findUnique({ where: { id: goodId } });
        if (!good) throw new Error('GOOD_NOT_FOUND');

        // Prisma сама выбросит ошибку P2002, если есть уникальный индекс (userId, goodId)
        return prisma.reviews.create({
            data: {
                userId,
                goodId,
                text: text.trim(),
                rating: Math.round(rating),
                image: image || null
            }
        });
    }

    static async checkExists(userId: number, goodId: number) {
        const exists = await prisma.reviews.findFirst({
            where: { userId, goodId }
        });
        return !!exists;
    }

    static async getByGoodId(goodId: number) {
        return prisma.reviews.findMany({
            where: { goodId },
            include: {
                user: { select: { username: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}