import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

router.use(authenticateToken);

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getOne);
router.get('/:id/goods', CategoryController.getGoods);
router.get('/by-good/:goodId', CategoryController.getByGood);

router.use(requireAuth, authorizeRoles(3));

router.post('/', CategoryController.create);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);
router.post('/:id/goods', CategoryController.addGood);
router.delete('/:id/goods/:goodId', CategoryController.removeGood);

export default router;