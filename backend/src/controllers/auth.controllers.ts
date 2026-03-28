import { Request, Response, NextFunction, type RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/auth';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prismaClient';
import { tokenService } from '../services/tokenService';
import { JWT_REFRESH_SECRET } from '../config/env';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../utils/AppError';
import { updateProfileSchema, changePasswordSchema } from '../validators/auth.schemas';

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

export const getMe: RequestHandler = async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const user = authReq.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    return res.json(user);
};

export const updateProfile = asyncHandler<AuthenticatedRequest>(async (req, res, next) => {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
        return next(new AppError(400, 'Ошибка валидации', parsed.error.flatten()));
    }
    if (!req.user?.id) return next(new AppError(401, 'Не авторизован'));
    const updated = await AuthService.updateProfile(req.user.id, parsed.data);
    res.json(updated);
});

export const changePassword = asyncHandler<AuthenticatedRequest>(async (req, res, next) => {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return next(new AppError(400, 'Ошибка валидации', parsed.error.flatten()));
    }
    if (!req.user?.id) return next(new AppError(401, 'Не авторизован'));
    const { currentPassword, newPassword } = parsed.data;
    await AuthService.changePassword(req.user.id, { currentPassword, newPassword });
    res.status(204).send();
});

export const logout: RequestHandler = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) await tokenService.removeToken(refreshToken);
    tokenService.clearCookies(res);
    return res.status(204).send();
};