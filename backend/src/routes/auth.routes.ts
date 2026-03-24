import { Router } from 'express';
import { register, login, refresh, getMe, logout } from '../controllers/auth.controllers';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth'; 

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

router.get('/me', authenticateToken, requireAuth, getMe);

router.post('/logout', authenticateToken, requireAuth, logout);

export default router;