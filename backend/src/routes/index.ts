import { Router } from 'express';
import authRoutes from './auth.routes';
import goodsRoutes from './goods.routes';
import basketRoutes from './basket.routes';
import ordersRoutes from './orders.routes';
import savesRoutes from './saves.routes'
import reviewsRoutes from './reviews.routes'
const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/goods', goodsRoutes);
routes.use('/basket', basketRoutes);
routes.use('/orders', ordersRoutes);
routes.use('/saves', savesRoutes);
routes.use('/reviews', reviewsRoutes);

export default routes;