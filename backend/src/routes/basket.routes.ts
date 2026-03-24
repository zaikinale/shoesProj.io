import { Router } from 'express';
import { BasketController } from '../controllers/basket.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth'; 

const router = Router();

router.use(authenticateToken, requireAuth);

router.get('/', BasketController.getBasket);
router.post('/add-good', BasketController.addItem);
router.put('/update-good/:itemId', BasketController.updateItem);
router.delete('/clear', BasketController.clear);
router.delete('/delete-good/:itemId', BasketController.deleteItem);

export default router;