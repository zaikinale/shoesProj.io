import { Server, Socket } from 'socket.io';

class SocketService {
    private _io: Server | null = null;
    init(io: Server) {
        this._io = io;

        this._io.on('connection', (socket: Socket) => {
            console.log('User connected:', socket.id);
            this.setupEvents(socket);
        });
    }

    private setupEvents(socket: Socket) {
        socket.on('join_ticket', (ticketId: string) => {
            const rooms = Array.from(socket.rooms);
            
            rooms.forEach(room => {
                if (room !== socket.id) socket.leave(room);
            });

            socket.join(`ticket_${ticketId}`);
            console.log(`User ${socket.id} joined room: ticket_${ticketId}`);
        });

        socket.on('send_message', (data: { ticketId: string; [key: string]: any }) => {
            socket.to(`ticket_${data.ticketId}`).emit('receive_message', data);
        });

        socket.on('typing', (data: { ticketId: string; username: string }) => {
            socket.to(`ticket_${data.ticketId}`).emit('display_typing', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    }

    emitToRoom(room: string, event: string, data: any) {
        if (!this._io) {
            console.error('Socket.io server not initialized!');
            return;
        }
        this._io.to(room).emit(event, data);
    }
}

export const socketService = new SocketService();