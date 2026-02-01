import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('❌ JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined in .env');
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, PORT };