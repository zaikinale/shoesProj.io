import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

const ADMIN_ROLE_ID = 3;
const isAdmin = (user: any) => user && user.roleID === ADMIN_ROLE_ID;

export class EmployeeController {
    static async getAll(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Access denied' });
        try {
            const employees = await EmployeeService.getAll();
            res.json(employees);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch' });
        }
    }

    static async create(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Access denied' });
        
        const { username, email, password, roleID } = req.body;
        if (!username || !email || !password || password.length < 6) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        try {
            const employee = await EmployeeService.create({ username, email, password, roleID });
            res.status(201).json(employee);
        } catch (error: any) {
            if (error.message === 'EMAIL_EXISTS') return res.status(400).json({ error: 'Email already registered' });
            res.status(500).json({ error: 'Failed to create' });
        }
    }

    static async updateRole(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Access denied' });
        
        try {
            const id = parseInt(req.params.id as string);
            const { roleID } = req.body;
            const currentUserId = (req as any).user.id;

            if (isNaN(id) || typeof roleID !== 'number') return res.status(400).json({ error: 'Valid data required' });

            const updated = await EmployeeService.updateRole(id, roleID, currentUserId);
            res.json(updated);
        } catch (error: any) {
            const messages: Record<string, number> = { 'NOT_FOUND': 404, 'CANNOT_MODIFY_ADMIN': 403, 'INVALID_ROLE': 400 };
            res.status(messages[error.message] || 500).json({ error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Access denied' });
        
        try {
            const id = parseInt(req.params.id as string);
            const currentUserId = (req as any).user.id;
            await EmployeeService.delete(id, currentUserId);
            res.status(204).send();
        } catch (error: any) {
            const messages: Record<string, number> = { 'NOT_FOUND': 404, 'SELF_DELETION': 400, 'CANNOT_DELETE_ADMIN': 403 };
            res.status(messages[error.message] || 500).json({ error: error.message });
        }
    }

    static async getRoles(req: Request, res: Response) {
        if (!isAdmin((req as any).user)) return res.status(403).json({ error: 'Access denied' });
        try {
            const roles = await EmployeeService.getRoles();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: 'Failed' });
        }
    }
}