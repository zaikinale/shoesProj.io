import type { RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/auth';

export const requireAuth: RequestHandler = (req, res, next) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }
    next();
};
