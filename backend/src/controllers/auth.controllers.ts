import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prismaClient';
import { tokenService } from '../services/tokenService';
import { JWT_REFRESH_SECRET } from '../config/env';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, roleID: 1 },
        });

        const tokens = tokenService.generateTokens(user.id, user.roleID);
        await tokenService.saveToken(user.id, tokens.refreshToken);
        tokenService.setTokensToCookies(res, tokens.accessToken, tokens.refreshToken);

        return res.status(201).json({ user: { id: user.id, username: user.username, roleID: user.roleID } });
    } catch (e) { return res.status(500).json({ error: 'Register failed' }); }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = tokenService.generateTokens(user.id, user.roleID);
        await tokenService.saveToken(user.id, tokens.refreshToken);
        tokenService.setTokensToCookies(res, tokens.accessToken, tokens.refreshToken);

        return res.json({ user: { id: user.id, username: user.username, roleID: user.roleID } });
    } catch (e) { return res.status(500).json({ error: 'Login failed' }); }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

        const userData = jwt.verify(refreshToken, JWT_REFRESH_SECRET!) as { userId: number };
        
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!tokenFromDb) return res.status(401).json({ error: 'Token not in DB' });

        const user = await prisma.user.findUnique({ where: { id: userData.userId } });
        if (!user) return res.status(401).json({ error: 'User not found' });

        const tokens = tokenService.generateTokens(user.id, user.roleID);
        await tokenService.saveToken(user.id, tokens.refreshToken);
        tokenService.setTokensToCookies(res, tokens.accessToken, tokens.refreshToken);

        return res.json({ message: 'Tokens refreshed' });
    } catch (e) {
        return res.status(401).json({ error: 'Token expired or invalid' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    return res.json(user);
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) await tokenService.removeToken(refreshToken);
    tokenService.clearCookies(res);
    return res.status(204).send();
};