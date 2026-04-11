import { prismaMock } from './__helpers__/prismaMock';
import request from 'supertest';
import app from '../src/app';
import bcrypt from 'bcrypt';
import { prisma } from '../src/utils/prismaClient';

describe('Auth Module', () => {
    it('POST /api/auth/login - success', async () => {
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            email: 'test@test.com',
            password: hashedPassword,
            roleID: 1,
        } as any);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: password });

        expect(res.status).toBe(200);
        expect(res.headers['set-cookie']).toBeDefined();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        (global as any).prisma = undefined;
    });
});
