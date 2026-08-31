import { Request, Response, NextFunction } from 'express';
import { machineCategoryService } from '../services/machineCategory.service';
import { createMachineCategorySchema, updateMachineCategorySchema } from '../schemas/machineCategory.schema';

export const machineCategoryController = {
  async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await machineCategoryService.findAll();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await machineCategoryService.findById(req.params.id as string);
      res.json(category);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createMachineCategorySchema.parse(req.body);
      const category = await machineCategoryService.create(data);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateMachineCategorySchema.parse(req.body);
      const category = await machineCategoryService.update(req.params.id as string, data);
      res.json(category);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await machineCategoryService.delete(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};