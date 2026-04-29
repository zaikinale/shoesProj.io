import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';
// import { authorizeRoles } from '../middleware/role';

const router = Router();

router.use(authenticateToken, requireAuth);

router.get('/', TicketController.getAll);
router.post('/', TicketController.create);
router.get('/:id', TicketController.getOne);
router.post('/:id/messages', TicketController.addMessage);
router.patch('/:id/close', TicketController.close);

export default router;