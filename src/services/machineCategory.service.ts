import { machineCategoryRepository } from '../repositories/machineCategory.repository';
import { CreateMachineCategoryInput, UpdateMachineCategoryInput } from '../schemas/machineCategory.schema';
import { AppError } from '../errors/AppError';
import { IMachineCategory } from '../models/machineCategory.model';

function handleMongooseError(err: unknown): never {
  const error = err as { name?: string; code?: number };

  if (error.code === 11000) {
    throw new AppError(409, 'Ya existe una categoría con ese nombre');
  }
  if (error.name === 'CastError') {
    throw new AppError(400, 'ID inválido');
  }
  throw err;
}

export const machineCategoryService = {
  async findAll(): Promise<IMachineCategory[]> {
    return machineCategoryRepository.findAll();
  },

  async findById(id: string): Promise<IMachineCategory> {
    try {
      const category = await machineCategoryRepository.findById(id);
      if (!category) throw new AppError(404, 'Categoría no encontrada');
      return category;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleMongooseError(err);
    }
  },

  async create(data: CreateMachineCategoryInput): Promise<IMachineCategory> {
    try {
      return await machineCategoryRepository.create(data);
    } catch (err) {
      handleMongooseError(err);
    }
  },

  async update(id: string, data: UpdateMachineCategoryInput): Promise<IMachineCategory> {
    try {
      const updated = await machineCategoryRepository.update(id, data);
      if (!updated) throw new AppError(404, 'Categoría no encontrada');
      return updated;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleMongooseError(err);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const deleted = await machineCategoryRepository.delete(id);
      if (!deleted) throw new AppError(404, 'Categoría no encontrada');
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleMongooseError(err);
    }
  },
};