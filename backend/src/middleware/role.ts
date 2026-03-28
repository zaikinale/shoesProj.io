import type { RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/auth';

export const authorizeRoles = (...allowedRoles: number[]): RequestHandler => {
    return (req, res, next) => {
        const authReq = req as AuthenticatedRequest;
        const user = authReq.user;

        if (!user || !allowedRoles.includes(user.roleID)) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }

        next();
    };
};
