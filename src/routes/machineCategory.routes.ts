import { Router } from 'express';
import { machineCategoryController } from '../controllers/machineCategory.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.use(authMiddleware);

router.get('/', machineCategoryController.findAll);
router.get('/:id', machineCategoryController.findById);
router.post('/', requireRole('admin'), machineCategoryController.create);
router.put('/:id', requireRole('admin'), machineCategoryController.update);
router.delete('/:id', requireRole('admin'), machineCategoryController.delete);

export default router;