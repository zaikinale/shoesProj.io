import { Router } from 'express';
import { GoodController } from '../controllers/good.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';
import { authorizeRoles } from '../middleware/role';
import { UserRole } from '../types/roles';

const router = Router();

router.use(authenticateToken);

router.get('/', GoodController.getAll);
router.get('/:id', GoodController.getOne);
router.post('/', requireAuth, authorizeRoles(UserRole.ADMIN, UserRole.MODERATOR), GoodController.create);
router.put('/:id', requireAuth, authorizeRoles(UserRole.ADMIN, UserRole.MODERATOR), GoodController.update);
router.delete('/:id', requireAuth, authorizeRoles(UserRole.ADMIN, UserRole.MODERATOR), GoodController.delete);

export default router;