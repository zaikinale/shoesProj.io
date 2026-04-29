import type { Request } from 'express';
import { UserRole } from './roles';

export type PublicAuthUser = {
    id: number;
    username: string;
    email: string;
    roleID: number;
};

export interface AuthenticatedRequest extends Request {
    user: PublicAuthUser | null;
}

export interface TokenPayload {
    userId: number;
    roleID: number;
    roleName: UserRole;
}