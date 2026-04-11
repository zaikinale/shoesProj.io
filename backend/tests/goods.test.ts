import { prismaMock } from './__helpers__/prismaMock';
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prismaClient';

describe('Goods Module', () => {
    it('should return 200 and mocked list', async () => {
        prismaMock.good.findMany.mockResolvedValue([
            { id: 1, title: 'Test Shoe', price: 5000, isActive: true }
        ] as any);

        const response = await request(app).get('/api/goods');
        
        expect(response.status).toBe(200);
        expect(response.body[0].title).toBe('Test Shoe');
    });
});


afterAll(async () => {
    await prisma.$disconnect();
    const globalForPrisma = global as unknown as { prisma: any };
    globalForPrisma.prisma = undefined;
});