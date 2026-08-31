import { Router } from 'express';
import { machineCategoryController } from '../controllers/machineCategory.controller';

const router = Router();

router.get('/', machineCategoryController.findAll);
router.get('/:id', machineCategoryController.findById);
router.post('/', machineCategoryController.create);
router.put('/:id', machineCategoryController.update);
router.delete('/:id', machineCategoryController.delete);

export default router;