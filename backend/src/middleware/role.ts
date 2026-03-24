import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...allowedRoles: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        // Если юзера нет или его роль не в списке разрешенных
        if (!user || !allowedRoles.includes(user.roleID)) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }

        next();
    };
};