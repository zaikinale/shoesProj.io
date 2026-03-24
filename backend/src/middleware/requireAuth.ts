import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }
    next();
};