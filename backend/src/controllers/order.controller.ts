import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

const isStaff = (user: any) => user && (user.roleID === 2 || user.roleID === 3);

export class OrderController {
    static async create(req: Request, res: Response) {
        try {
            const order = await OrderService.createOrder((req as any).user.id);
            res.status(201).json(order);
        } catch (error: any) {
            if (error.message === 'BASKET_EMPTY') return res.status(400).json({ error: error.message });
            if (error.message.startsWith('INACTIVE_GOODS')) return res.status(400).json({ error: error.message });
            res.status(500).json({ error: 'Failed to create order' });
        }
    }

    static async getAll(req: Request, res: Response) {
        if (!isStaff((req as any).user)) return res.status(403).json({ error: 'Access denied' });
        try {
            const orders = await OrderService.getAllOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch' });
        }
    }

    static async getMy(req: Request, res: Response) {
        try {
            const orders = await OrderService.getUserOrders((req as any).user.id);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Failed' });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const orderId = parseInt(req.params.id as string);
            const user = (req as any).user;
            const order = await OrderService.getOrderById(orderId, user.id, isStaff(user));
            
            if (!order) return res.status(404).json({ error: 'Order not found' });
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: 'Error' });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        if (!isStaff((req as any).user)) return res.status(403).json({ error: 'Access denied' });
        
        const { status } = req.body;
        const validStatuses = ['created', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!status || !validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

        try {
            const updated = await OrderService.updateStatus(parseInt(req.params.id as string), status);
            res.json(updated);
        } catch (error: any) {
            res.status(error.code === 'P2025' ? 404 : 500).json({ error: 'Update failed' });
        }
    }

    static async cancel(req: Request, res: Response) {
        try {
            await OrderService.cancelOrder(parseInt(req.params.id as string), (req as any).user.id);
            res.json({ message: 'Cancelled' });
        } catch (error: any) {
            res.status(403).json({ error: error.message });
        }
    }
}