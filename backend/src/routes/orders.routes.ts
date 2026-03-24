import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

router.use(authenticateToken, requireAuth);

router.post('/', OrderController.create);
router.get('/my', OrderController.getMy);
router.get('/:id', OrderController.getById);
router.delete('/:id/cancel', OrderController.cancel);
router.get('/', authorizeRoles(2, 3), OrderController.getAll);
router.put('/:id/status', authorizeRoles(2, 3), OrderController.updateStatus);

export default router;