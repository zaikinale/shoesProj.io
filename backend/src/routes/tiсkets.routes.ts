import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const isStaff = (user: any) => user && (user.roleID === 2 || user.roleID === 3);

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;

    try {
        const tickets = await prisma.ticket.findMany({
            where: isStaff(user) ? {} : { userId: user.id },
            include: {
                user: { select: { username: true } },
                _count: { select: { messages: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(tickets);
    } catch (error: any) {
        console.error('Get tickets error:', error.message);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const id = parseInt(req.params.id as string);

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                messages: {
                    include: { author: { select: { username: true, roleID: true } } },
                    orderBy: { createdAt: 'asc' }
                },
                order: true 
            }
        });

        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        
        if (ticket.userId !== user.id && !isStaff(user)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(ticket);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch ticket' });
    }
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { subject, category, orderId } = req.body;

    if (!subject || !category) {
        return res.status(400).json({ error: 'Subject and category are required' });
    }

    try {
        const ticket = await prisma.ticket.create({
            data: {
                subject,
                category,
                userId: user.id,
                orderId: orderId ? parseInt(orderId.toString()) : null,
                status: 'open'
            }
        });
        res.status(201).json(ticket);
    } catch (error: any) {
        console.error('Create ticket error:', error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

router.post('/:id/messages', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const ticketId = parseInt(req.params.id as string);
    const { text, image } = req.body;

    if (!text) return res.status(400).json({ error: 'Message text is required' });

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        
        if (ticket.userId !== user.id && !isStaff(user)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const message = await prisma.message.create({
            data: {
                text,
                image: image || null,
                ticketId,
                authorId: user.id
            },
            include: { author: { select: { username: true, roleID: true } } }
        });

        await prisma.ticket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() }
        });

        res.status(201).json(message);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

router.patch('/:id/close', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const id = parseInt(req.params.id as string);

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        if (ticket.userId !== user.id && !isStaff(user)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: { status: 'closed' }
        });

        res.json(updatedTicket);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to close ticket' });
    }
});

export default router;