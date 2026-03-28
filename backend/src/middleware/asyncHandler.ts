import type { Request, Response, NextFunction, RequestHandler } from 'express';

/** Async-route: ошибки уходят в next(err). TRequest — например AuthenticatedRequest. */
export function asyncHandler<TRequest extends Request = Request>(
    fn: (req: TRequest, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(fn(req as TRequest, res, next)).catch(next);
    };
}
