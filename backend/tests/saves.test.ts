import { prismaMock } from './__helpers__/prismaMock';
import request from 'supertest';
import app from '../src/app';
import { getAuthCookie } from './setup';
import { prisma } from '../src/utils/prismaClient';

describe('Saves Module', () => {
    const userCookie = getAuthCookie(1, 1);

    it('POST /api/saves - add to favorites', async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            roleID: 1,
            email: 'u@test.com',
            username: 'u',
        } as any);
        prismaMock.good.findUnique.mockResolvedValue({ id: 5, title: 'G', price: 1 } as any);
        prismaMock.save.upsert.mockResolvedValue({ userId: 1, goodId: 5 } as any);

        const res = await request(app)
            .post('/api/saves')
            .set('Cookie', [userCookie])
            .send({ goodId: 5 });

        expect(res.status).toBe(201);
    });

    it('DELETE /api/saves/:id - remove from favorites', async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            roleID: 1,
            email: 'u@test.com',
            username: 'u',
        } as any);
        prismaMock.save.deleteMany.mockResolvedValue({ count: 1 } as any);

        const res = await request(app)
            .delete('/api/saves/5')
            .set('Cookie', [userCookie]);

        expect(res.status).toBe(200);
    });
});


afterAll(async () => {
    await prisma.$disconnect();
    const globalForPrisma = global as unknown as { prisma: any };
    globalForPrisma.prisma = undefined;
});