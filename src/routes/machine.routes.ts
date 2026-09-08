import { Router } from 'express';
import { machineController } from '../controllers/machine.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', machineController.findAll);
router.get('/:id', machineController.findById);
router.post('/', machineController.create);
router.put('/:id', machineController.update);
router.delete('/:id', machineController.delete);

export default router;