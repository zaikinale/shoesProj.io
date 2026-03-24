// import { Router } from 'express';
// import { ReviewController } from '../controllers/review.controller';
// import { authenticateToken } from '../middleware/auth';

// const router = Router();

// router.get('/:goodId', ReviewController.getByGood);

// router.post('/', authenticateToken, ReviewController.create);
// router.get('/check/:goodId', authenticateToken, ReviewController.check);

// export default router;

import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

/**
 * ПУБЛИЧНЫЙ ДОСТУП
 * Позволяет любому пользователю (даже не залогиненному) 
 * просматривать отзывы к товару.
 */
router.get('/:goodId', ReviewController.getByGood);

/**
 * ПРИВАТНЫЕ РОУТЫ
 * Требуют обязательной авторизации.
 */
// Сначала парсим токен, затем проверяем его наличие
router.use(authenticateToken, requireAuth);

// Написать новый отзыв
router.post('/', ReviewController.create);

// Проверить, оставлял ли текущий пользователь отзыв на этот товар
router.get('/check/:goodId', ReviewController.check);

export default router;