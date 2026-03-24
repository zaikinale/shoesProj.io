import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../config/env';
import { prisma } from '../utils/prismaClient';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        (req as any).user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET!) as { userId: number, roleID: number };
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, roleID: true, email: true, username: true }
        });

        (req as any).user = user;
        next();
    } catch (err: any) {
        (req as any).user = null;
        next();
    }
};