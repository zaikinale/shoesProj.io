import { server } from './app';
import { PORT } from './config/env';

const port = PORT || 3001;

server.listen(port, () => {
    console.log(`Сервер и Socket.IO: http://localhost:${port}`);
});