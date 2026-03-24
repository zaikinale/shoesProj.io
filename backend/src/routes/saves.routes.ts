import { Router } from 'express';
import { SaveController } from '../controllers/save.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(authenticateToken, requireAuth);
router.get('/', SaveController.getSaves);
router.get('/check/:goodId', SaveController.check);
router.post('/', SaveController.save);
router.delete('/:goodId', SaveController.remove);

export default router;