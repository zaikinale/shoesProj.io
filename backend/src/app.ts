import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5174',
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Твой дебаг-роут (вернул, как просил)
app.get('/debug-auth', (req, res) => {
    res.json({ 
        cookies_header: req.headers.cookie, 
        parsed_cookies: req.cookies 
    });
});

app.use('/api', routes);

// Исправленный 404 (без ошибки pathToRegexp)
app.use('/*any', (req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Socket Logic
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
        // Здесь 'data' должен содержать { ticketId, text, image, ... }
        // Эмиттим всем в комнате тикета
        socket.to(`ticket_${data.ticketId}`).emit('receive_message', data);
    });

    socket.on('typing', (data) => {
        socket.to(`ticket_${data.ticketId}`).emit('display_typing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server & Sockets running on port ${PORT}`);
});

export default app;