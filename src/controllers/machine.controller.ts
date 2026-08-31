import { Request, Response, NextFunction } from 'express';
import { machineService } from '../services/machine.service';
import { createMachineSchema, updateMachineSchema } from '../schemas/machine.schema';

export const machineController = {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query['page']) || 1;
      const limit = Number(req.query['limit']) || 10;
      const result = await machineService.findAll(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const machine = await machineService.findById(req.params.id as string);
      res.json(machine);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createMachineSchema.parse(req.body);
      const machine = await machineService.create(data);
      res.status(201).json(machine);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateMachineSchema.parse(req.body);
      const machine = await machineService.update(req.params.id as string, data);
      res.json(machine);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await machineService.delete(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};