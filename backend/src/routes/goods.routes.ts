import { Router } from 'express';
import { GoodController } from '../controllers/good.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

router.use(authenticateToken);

router.get('/', GoodController.getAll);
router.get('/:id', GoodController.getOne);
router.post('/', requireAuth, authorizeRoles(2, 3), GoodController.create);
router.put('/:id', requireAuth, authorizeRoles(2, 3), GoodController.update);
router.delete('/:id', requireAuth, authorizeRoles(2, 3), GoodController.delete);

export default router;