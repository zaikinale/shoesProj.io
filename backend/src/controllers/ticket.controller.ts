import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';

const isStaff = (user: any) => user && (user.roleID === 2 || user.roleID === 3);

export class TicketController {
    static async getAll(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const tickets = await TicketService.getAll(user.id, isStaff(user));
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tickets' });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const id = parseInt(req.params.id as string);
            
            const ticket = await TicketService.getById(id, user.id, isStaff(user));
            
            res.json(ticket);
        } catch (error: any) {
            const status = error.message === 'NOT_FOUND' ? 404 : 403;
            res.status(status).json({ error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { subject, category, orderId } = req.body;
            if (!subject || !category) return res.status(400).json({ error: 'Subject and category required' });
            
            const ticket = await TicketService.create((req as any).user.id, {
                subject, category, orderId: orderId ? parseInt(orderId) : undefined
            });
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create' });
        }
    }

    static async addMessage(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const ticketId = parseInt(req.params.id as string);
            const { text, image } = req.body;

            if (!text) return res.status(400).json({ error: 'Message text required' });

            const message = await TicketService.addMessage(ticketId, user.id, isStaff(user), { text, image });
            res.status(201).json(message);
        } catch (error: any) {
            const status = error.message === 'NOT_FOUND' ? 404 : 403;
            res.status(status).json({ error: error.message });
        }
    }

    static async markAsRead(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        const ticketId = parseInt(req.params.id as string);

        await TicketService.markAsRead(ticketId, user.id); 

        return res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error('Error marking as read:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

    static async close(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const id = parseInt(req.params.id as string);
            const updated = await TicketService.close(id, user.id, isStaff(user));
            res.json(updated);
        } catch (error: any) {
            const status = error.message === 'NOT_FOUND' ? 404 : 403;
            res.status(status).json({ error: error.message });
        }
    }
}