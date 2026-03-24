import request from 'supertest';
import app from '../src/app';
import { prismaMock } from './__helpers__/prismaMock';
import { getAuthCookie } from './setup';
import { prisma } from '../src/utils/prismaClient';

describe('Saves Module', () => {
    const userCookie = getAuthCookie(1, 1);

    it('POST /api/saves - add to favorites', async () => {
        prismaMock.save.create.mockResolvedValue({ userId: 1, goodId: 5 } as any);

        const res = await request(app)
            .post('/api/saves')
            .set('Cookie', [userCookie])
            .send({ goodId: 5 });

        expect(res.status).toBe(201);
    });

    it('DELETE /api/saves/:id - remove from favorites', async () => {
        prismaMock.save.delete.mockResolvedValue({} as any);

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