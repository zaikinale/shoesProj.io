import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prismaClient';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config/env';

const generateAndSaveTokens = async (userId: number, res: Response) => {
    const accessToken = jwt.sign({ userId }, JWT_ACCESS_SECRET!, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET!, { expiresIn: '7d' });

    await prisma.token.create({
        data: { refreshToken, userId }
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return accessToken;
};

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { username, email, password: hashedPassword, roleID: 1 },
    });

    const accessToken = await generateAndSaveTokens(user.id, res);

    res.status(201).json({ 
        user: { id: user.id, username: user.username, email: user.email, roleID: user.roleID }, 
        accessToken 
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    await prisma.token.deleteMany({ where: { userId: user.id } });

    const accessToken = await generateAndSaveTokens(user.id, res);

    res.json({ 
        user: { id: user.id, username: user.username, email: user.email, roleID: user.roleID }, 
        accessToken 
    });
};

const generateTokens = (userId: number) => {
    const accessToken = jwt.sign({ userId }, JWT_ACCESS_SECRET!, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET!, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};


export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token not found' });
        }

        const userData = jwt.verify(refreshToken, JWT_REFRESH_SECRET!) as { userId: number };

        const tokenFromDb = await prisma.token.findUnique({
            where: { refreshToken }
        });

        if (!tokenFromDb) {
            await prisma.token.deleteMany({ where: { userId: userData.userId } });
            return res.status(403).json({ error: 'Token reuse detected. Please login again.' });
        }

        const tokens = generateTokens(userData.userId);

        await prisma.$transaction([
            prisma.token.delete({ where: { id: tokenFromDb.id } }),
            prisma.token.create({ 
                data: { 
                    refreshToken: tokens.refreshToken, 
                    userId: userData.userId 
                } 
            })
        ]);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ accessToken: tokens.accessToken });

    } catch (err) {
        return res.status(401).json({ error: 'Refresh token expired or invalid' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            await prisma.token.deleteMany({
                where: { refreshToken }
            });
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: 'Logout failed' });
    }
};