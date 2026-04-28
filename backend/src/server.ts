import { server } from './app';
import { PORT } from './config/env';

const port = PORT;

server.listen(port, () => {
    console.log(`Сервер и Socket.IO: http://localhost:${port}`);
});