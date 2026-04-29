import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/:goodId', ReviewController.getByGood);

router.use(authenticateToken, requireAuth);

router.post('/', ReviewController.create);

router.get('/check/:goodId', ReviewController.check);

export default router;