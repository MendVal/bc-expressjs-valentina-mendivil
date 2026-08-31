import { Router } from 'express';
import { machineController } from '../controllers/machine.controller';

const router = Router();

router.get('/', machineController.findAll);
router.get('/:id', machineController.findById);
router.post('/', machineController.create);
router.put('/:id', machineController.update);
router.delete('/:id', machineController.delete);

export default router;