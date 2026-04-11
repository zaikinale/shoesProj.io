import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../src/config/env';

export const getAuthToken = (userId: number, roleID: number = 1) => {
    return jwt.sign({ userId, roleID }, JWT_ACCESS_SECRET!, { expiresIn: '1h' });
};

export const getAuthCookie = (userId: number, roleID: number = 1) => {
    const token = getAuthToken(userId, roleID);
    return `accessToken=${token}; token=${token}`;
};