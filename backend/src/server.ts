import app from './app';
import { PORT } from './config/env';

const port = PORT || 3000;

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});