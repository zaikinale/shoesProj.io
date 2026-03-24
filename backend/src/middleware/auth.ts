// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { JWT_ACCESS_SECRET } from '../config/env';
// import { prisma } from '../utils/prismaClient';

// export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.cookies?.accessToken;
    
//     console.log('Access token from cookie:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

//     if (!token) {
//         console.log('No access token - allowing public access');
//         (req as any).user = null; 
//         return next(); 
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_ACCESS_SECRET!) as { userId: number };
//         console.log('Decoded token:', decoded);

//         const user = await prisma.user.findUnique({
//             where: { id: decoded.userId },
//             select: { id: true, roleID: true, email: true }
//         });

//         console.log('Found user:', user);

//         if (!user) {
//             console.log('User not found in database');
//             return res.status(403).json({ error: 'Invalid or expired token' });
//         }

//         (req as any).user = user;
//         next();
//     } catch (err) {
//         console.error('Token verification error:', err);
        
//         if (err instanceof jwt.TokenExpiredError) {
//             console.log('Access token expired');
//             return res.status(401).json({ error: 'Access token expired' });
//         } else if (err instanceof jwt.JsonWebTokenError) {
//             console.log('Invalid token signature');
//         }
        
//         return res.status(403).json({ error: 'Invalid or expired token' });
//     }
// };

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
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET!) as { userId: number };
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, roleID: true, email: true }
        });

        if (!user) {
            (req as any).user = null;
            return next();
        }

        (req as any).user = user;
        next();
    } catch (err) {
        (req as any).user = null;
        // Если токен протух или "битый", мы не прерываем запрос здесь, 
        // чтобы публичные роуты (список товаров) всё равно работали.
        next();
    }
};