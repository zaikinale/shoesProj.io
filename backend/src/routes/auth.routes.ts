import { Router } from 'express';
import { register, login, refresh, getMe, logout } from '../controllers/auth.controllers'; // Добавили getMe и logout
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authenticateToken, getMe);
router.post('/logout', logout);

export default router;