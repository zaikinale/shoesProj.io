// Конфигурация Jest для Supertest + моки Prisma (см. tests/__helpers__/prismaMock.ts)
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30_000,
    maxWorkers: process.env.CI ? 2 : '50%',
    testMatch: ['**/tests/**/*.test.ts'],
};
