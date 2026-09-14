import { Router } from 'express';
import { machineController } from '../controllers/machine.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.use(authMiddleware);

router.get('/', machineController.findAll);
router.get('/:id', machineController.findById);
router.post('/', requireRole('admin'), machineController.create);
router.put('/:id', requireRole('admin'), machineController.update);
router.delete('/:id', requireRole('admin'), machineController.delete);

export default router;