import type { Request } from 'express';

/** Публичные поля пользователя в JSON-ответах (без пароля). */
export type PublicAuthUser = {
    id: number;
    username: string;
    email: string;
    roleID: number;
};

/**
 * Запрос с данными сессии после authenticateToken (user — объект или null).
 * Используйте приведение: `req as AuthenticatedRequest` внутри RequestHandler.
 */
export interface AuthenticatedRequest extends Request {
    user: PublicAuthUser | null;
}
