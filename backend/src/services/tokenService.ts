import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config/env';

const COOKIE_SETTINGS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax' as const,
    path: '/',
};

export const tokenService = {
    generateTokens(userId: number, roleID: number) {
        const accessToken = jwt.sign({ userId, roleID }, JWT_ACCESS_SECRET!, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET!, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    },

    async saveToken(userId: number, refreshToken: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); 

        return await prisma.token.create({
            data: { 
                refreshToken, 
                userId,
                expiresAt 
            }
        });
    },

    async findToken(refreshToken: string) {
        return await prisma.token.findUnique({ 
            where: { refreshToken },
            include: { user: true } 
        });
    },

    async removeToken(refreshToken: string) {
        return await prisma.token.delete({ where: { refreshToken } });
    },

    async removeAllUserTokens(userId: number) {
        return await prisma.token.deleteMany({ where: { userId } });
    },

    setTokensToCookies(res: Response, accessToken: string, refreshToken: string) {
        res.cookie('accessToken', accessToken, { ...COOKIE_SETTINGS, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { ...COOKIE_SETTINGS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    },

    clearCookies(res: Response) {
        res.clearCookie('accessToken', { ...COOKIE_SETTINGS, path: '/' });
        res.clearCookie('refreshToken', { ...COOKIE_SETTINGS, path: '/' });
    }
};