import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../config/env';
import { prisma } from '../utils/prismaClient';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET!) as { userId: number };
        console.log('Decoded token:', decoded);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, roleID: true, email: true }
        });

        console.log('Found user:', user);

        if (!user) {
            console.log('User not found in database');
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        (req as any).user = user;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        if (err instanceof jwt.TokenExpiredError) {
            console.log('Token expired');
        } else if (err instanceof jwt.JsonWebTokenError) {
            console.log('Invalid token signature');
        }
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};