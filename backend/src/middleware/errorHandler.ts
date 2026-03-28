import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { isProduction } from '../config/env';

/** В production не отдаём stack и внутренние детали клиенту. */
export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            ...(err.details !== undefined ? { details: err.details } : {}),
        });
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Ошибка валидации',
            details: err.flatten(),
        });
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const target = err.meta?.target;
        const field =
            Array.isArray(target) && target.length > 0 ? String(target[0]) : 'поле';
        res.status(409).json({
            error:
                field === 'email'
                    ? 'Этот email уже используется'
                    : 'Значение уже занято',
        });
        return;
    }

    console.error('[errorHandler]', err);

    if (isProduction) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        return;
    }

    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    res.status(500).json({
        error: message,
        stack: err instanceof Error ? err.stack : undefined,
    });
}
