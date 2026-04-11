import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { FRONTEND_ORIGIN } from './config/env';

const app = express();
const server = http.createServer(app);

const allowedOrigins = FRONTEND_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
const corsOriginHandler = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
) => {
    if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
    }
    callback(null, false);
};

const io = new Server(server, {
    cors: {
        origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
);
app.use(cookieParser());
app.use(
    cors({
        origin: corsOriginHandler,
        credentials: true,
    })
);
app.use(express.json({ limit: '10mb' }));

app.get('/debug-auth', (req, res) => {
    res.json({ 
        cookies_header: req.headers.cookie, 
        parsed_cookies: req.cookies 
    });
});

app.use('/api', routes);

app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_ticket', (ticketId) => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
            if (room !== socket.id) socket.leave(room);
        });
        socket.join(`ticket_${ticketId}`);
        console.log(`User ${socket.id} joined room ticket_${ticketId}`);
    });

    socket.on('send_message', (data) => {
        socket.to(`ticket_${data.ticketId}`).emit('receive_message', data);
    });

    socket.on('typing', (data) => {
        socket.to(`ticket_${data.ticketId}`).emit('display_typing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

export default app;
export { server, io };