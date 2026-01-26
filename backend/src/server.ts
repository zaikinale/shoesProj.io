// import express from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const app = express();
// app.use(express.json());

// app.get('/', async (req, res) => {
//   // const users = await prisma.user.findMany();
//   res.json('Live')
// });

// app.listen(3000, () => {
//   console.log('✅ Сервер запущен на http://localhost:3000');
// });
import app from './app';
import { PORT } from './config/env';

const port = PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Сервер запущен на http://localhost:${port}`);
});