import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';
import { authorizeRoles } from '../middleware/role';
import { UserRole } from '../types/roles';

const router = Router();

router.use(authenticateToken, requireAuth);

router.post('/', OrderController.create);
router.get('/my', OrderController.getMy);
router.get('/:id', OrderController.getById);
router.delete('/:id/cancel', authorizeRoles(UserRole.ADMIN), OrderController.cancel);
router.get('/', authorizeRoles(UserRole.ADMIN, UserRole.MANAGER), OrderController.getAll);
router.put('/:id/status', authorizeRoles(UserRole.ADMIN, UserRole.MANAGER), OrderController.updateStatus);

export default router;