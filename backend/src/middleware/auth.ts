import { Request, Response, NextFunction } from 'express'; 
import jwt from 'jsonwebtoken'; 
import { prisma } from '../utils/prismaClient'; 
import { JWT_SECRET } from '../config/env'; 

export const authenticateToken = async ( req: Request, res: Response, next: NextFunction ) => { 
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) { 
        return res.status(401).json({ error: 'Access token required' }); 
    } 
    try { 
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }; 
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } }); 
        if (!user) { 
            return res.status(401).json({ error: 'User not found' }); 
        } // Прикрепляем пользователя к запросу 
        (req as any).user = user; 
        next(); 
    } catch (err) { 
        return res.status(403).json({ error: 'Invalid token' }); 
    } 
};