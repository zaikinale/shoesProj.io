import { prismaMock } from './__helpers__/prismaMock';
import request from 'supertest';
import app from '../src/app';
import { getAuthCookie, getAuthToken } from './setup';
import { prisma } from '../src/utils/prismaClient';

describe('Catalog (Goods & Categories)', () => {
    it('GET /api/goods - should be public', async () => {
        prismaMock.good.findMany.mockResolvedValue([]);
        const res = await request(app).get('/api/goods');
        expect(res.status).toBe(200);
    });

    it('POST /api/categories - should block non-admins (role 1)', async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            roleID: 1,
            email: 'user@test.com',
            username: 'user',
        } as any);

        const token = getAuthToken(1, 1);
        const cookie = getAuthCookie(1, 1);

        const res = await request(app)
            .post('/api/categories')
            .set('Cookie', [cookie])
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New Category' });

        expect(res.status).toBe(403); 
    });

    it('POST /api/categories - should allow admin (role 3)', async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            roleID: 3,
            email: 'admin@test.com',
            username: 'admin',
        } as any);

        const token = getAuthToken(1, 3);
        const cookie = getAuthCookie(1, 3);

        prismaMock.category.create.mockResolvedValue({ id: 1, name: 'Games' } as any);

        const res = await request(app)
            .post('/api/categories')
            .set('Cookie', [cookie])
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Games' });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Games');
    });
});

afterAll(async () => {
    await prisma.$disconnect();
    const globalForPrisma = global as unknown as { prisma: any };
    globalForPrisma.prisma = undefined;
});