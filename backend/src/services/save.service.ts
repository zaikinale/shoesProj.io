import { prisma } from '../utils/prismaClient';

export class SaveService {
    static async getSavedGoods(userId: number) {
        const saves = await prisma.save.findMany({
            where: { userId },
            include: { good: true }
        });
        return saves.map(save => save.good);
    }

    static async checkIsSaved(userId: number, goodId: number) {
        const exists = await prisma.save.findFirst({
            where: { userId, goodId }
        });
        return !!exists;
    }

    static async saveGood(userId: number, goodId: number) {
        const good = await prisma.good.findUnique({ where: { id: goodId } });
        if (!good) throw new Error('GOOD_NOT_FOUND');

        return prisma.save.upsert({
            where: { userId_goodId: { userId, goodId } },
            create: { userId, goodId },
            update: {}
        });
    }

    static async removeGood(userId: number, goodId: number) {
        const result = await prisma.save.deleteMany({
            where: { userId, goodId }
        });
        
        if (result.count === 0) throw new Error('NOT_SAVED');
        return result;
    }
}