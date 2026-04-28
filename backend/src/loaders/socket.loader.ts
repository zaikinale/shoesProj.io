import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketService } from '../services/socket.service';

export const initSocket = (server: HttpServer, allowedOrigins: string | string[]) => {
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    socketService.init(io);

    return io;
};