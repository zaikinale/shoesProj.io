import type { Request } from 'express';

export type PublicAuthUser = {
    id: number;
    username: string;
    email: string;
    roleID: number;
};

export interface AuthenticatedRequest extends Request {
    user: PublicAuthUser | null;
}
