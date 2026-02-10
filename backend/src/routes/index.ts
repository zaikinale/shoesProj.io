import { Router } from 'express';
import authRoutes from './auth.routes';
import goodsRoutes from './goods.routes';
import basketRoutes from './basket.routes';
import ordersRoutes from './orders.routes';
import savesRoutes from './saves.routes'
const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/goods', goodsRoutes);
routes.use('/basket', basketRoutes);
routes.use('/orders', ordersRoutes);
routes.use('/saves', savesRoutes);

export default routes;