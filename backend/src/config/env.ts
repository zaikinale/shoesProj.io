import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET must be defined in .env');
}

const JWT_SECRET = process.env.JWT_SECRET; 
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export { JWT_SECRET, PORT };