// routes/employees.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';
import bcrypt from 'bcrypt';

const router = Router();
const ADMIN_ROLE_ID = 3;

const isAdmin = (user: any) => user && user.roleID === ADMIN_ROLE_ID;

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    try {
        const employees = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                roleID: true,
                role: { select: { name: true } },
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(employees);
    } catch (error: any) {
        console.error('Get employees error:', error.message);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    const { username, email, password, roleID } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email and password are required' });
    }
    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid input types' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                roleID: roleID && typeof roleID === 'number' ? roleID : 1
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleID: true,
                createdAt: true
            }
        });

        res.status(201).json(newEmployee);
    } catch (error: any) {
        console.error('Create employee error:', error.message);
        res.status(500).json({ error: 'Failed to create employee' });
    }
});

router.put('/:id/role', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    const id = parseInt(req.params.id as string);
    const { roleID } = req.body;

    if (isNaN(id) || !roleID || typeof roleID !== 'number') {
        return res.status(400).json({ error: 'Valid ID and roleID are required' });
    }

    try {
        const target = await prisma.user.findUnique({ where: { id } });
        if (!target) return res.status(404).json({ error: 'Employee not found' });

        if (target.roleID === ADMIN_ROLE_ID && target.id !== user.id) {
            return res.status(403).json({ error: 'Cannot modify other administrators' });
        }

        const role = await prisma.role.findUnique({ where: { id: roleID } });
        if (!role) return res.status(400).json({ error: 'Invalid role ID' });

        const updated = await prisma.user.update({
            where: { id },
            data: { roleID },
            select: {
                id: true,
                username: true,
                email: true,
                roleID: true,
                role: { select: { name: true } }
            }
        });

        res.json(updated);
    } catch (error: any) {
        console.error('Update role error:', error.message);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid employee ID' });

    try {
        const target = await prisma.user.findUnique({ where: { id } });
        if (!target) return res.status(404).json({ error: 'Employee not found' });

        if (target.roleID === ADMIN_ROLE_ID) {
            return res.status(403).json({ error: 'Cannot delete administrators' });
        }

        if (target.id === user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await prisma.user.delete({ where: { id } });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Employee not found' });
        }
        console.error('Delete employee error:', error.message);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

router.get('/roles', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

    try {
        const roles = await prisma.role.findMany({
            select: { id: true, name: true },
            orderBy: { id: 'asc' }
        });
        res.json(roles);
    } catch (error: any) {
        console.error('Get roles error:', error.message);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
});

export default router;