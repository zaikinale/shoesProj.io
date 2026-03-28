import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../config/env';
import { prisma } from '../utils/prismaClient';
import type { AuthenticatedRequest } from '../types/auth';

/** RequestHandler + внутренний cast — совместимо с Router и ts-node */
export const authenticateToken: RequestHandler = async (req, res, next) => {
    const authReq = req as AuthenticatedRequest;
    const token = authReq.cookies?.accessToken;

    if (!token) {
        authReq.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET!) as { userId: number; roleID: number };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, roleID: true, email: true, username: true },
        });

        authReq.user = user;
        next();
    } catch {
        authReq.user = null;
        next();
    }
};
