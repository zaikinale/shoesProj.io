import { prismaMock } from './__helpers__/prismaMock';
import request from 'supertest';
import app from '../src/app';
import { getAuthCookie, getAuthToken } from './setup';
import { prisma } from '../src/utils/prismaClient';

describe('Orders API', () => {
    it('GET /api/orders/my — список заказов пользователя', async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            roleID: 1,
            email: 'u@test.com',
            username: 'u',
        } as any);

        prismaMock.order.findMany.mockResolvedValue([
            {
                id: 1,
                userId: 1,
                status: 'created',
                items: [],
            },
        ] as any);

        const token = getAuthToken(1, 1);
        const cookie = getAuthCookie(1, 1);

        const res = await request(app)
            .get('/api/orders/my')
            .set('Cookie', [cookie])
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    afterAll(async () => {
        await prisma.$disconnect();
        (global as any).prisma = undefined;
    });
});
