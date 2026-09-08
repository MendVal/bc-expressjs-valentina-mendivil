import { Router } from 'express';
import { machineCategoryController } from '../controllers/machineCategory.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', machineCategoryController.findAll);
router.get('/:id', machineCategoryController.findById);
router.post('/', machineCategoryController.create);
router.put('/:id', machineCategoryController.update);
router.delete('/:id', machineCategoryController.delete);

export default router;