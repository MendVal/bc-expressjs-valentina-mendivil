import { Router } from 'express';
import * as controller from '../controllers/machines.controller';

export const machinesRouter = Router();

machinesRouter.get('/', controller.getAll);
machinesRouter.get('/:id', controller.getById);
machinesRouter.post('/', controller.create);
machinesRouter.put('/:id', controller.update);
machinesRouter.delete('/:id', controller.remove);