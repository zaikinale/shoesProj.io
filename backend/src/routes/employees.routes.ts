import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

router.use(authenticateToken, requireAuth, authorizeRoles(3));

router.get('/', EmployeeController.getAll);
router.post('/', EmployeeController.create);
router.get('/roles', EmployeeController.getRoles);
router.put('/:id/role', EmployeeController.updateRole);
router.delete('/:id', EmployeeController.delete);

export default router;