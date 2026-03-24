import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { prisma } from '../../src/utils/prismaClient';

// 1. ГОВОРИМ JEST ПОДМЕНИТЬ МОДУЛЬ
jest.mock('../../src/utils/prismaClient', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

// 2. Экспортируем прокси для тестов
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});