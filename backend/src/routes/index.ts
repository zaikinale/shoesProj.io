import { Router } from 'express';
import authRoutes from './auth.routes';
import goodsRoutes from './goods.routes';
const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/goods', goodsRoutes);

export default routes;