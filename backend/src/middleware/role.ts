import type { RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/auth';
import { UserRole } from '../types/roles';

export const authorizeRoles = (...allowedRoles: UserRole[]): RequestHandler => {
    return (req, res, next) => {
        const authReq = req as AuthenticatedRequest;
        const user = authReq.user;

        if (!user || !allowedRoles.includes(user.roleID)) {
            return res.status(403).json({ 
                error: 'Access denied: Insufficient permissions' 
            });
        }

        next();
    };
};