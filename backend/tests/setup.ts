import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test_secret';

export const getAuthToken = (userId: number, roleID: number = 1) => {
    return jwt.sign({ userId, roleID }, JWT_ACCESS_SECRET, { expiresIn: '1h' });
};

export const getAuthCookie = (userId: number, roleID: number = 1) => {
    const token = getAuthToken(userId, roleID);
    // Пробуем два варианта имени куки. 
    // Если в контроллере req.cookies.token, то сработает второй.
    return `accessToken=${token}; token=${token}`;
};