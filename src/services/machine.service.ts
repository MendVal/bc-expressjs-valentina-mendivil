import { machineRepository } from '../repositories/machine.repository';
import { machineCategoryRepository } from '../repositories/machineCategory.repository';
import { CreateMachineInput, UpdateMachineInput } from '../schemas/machine.schema';
import { AppError } from '../errors/AppError';
import { IMachine } from '../models/machine.model';

function handleMongooseError(err: unknown): never {
  const error = err as { name?: string; code?: number };

  if (error.code === 11000) {
    throw new AppError(409, 'Ya existe una máquina con ese valor único');
  }
  if (error.name === 'CastError') {
    throw new AppError(400, 'ID inválido');
  }
  throw err;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const machineService = {
  async findAll(page: number, limit: number): Promise<PaginatedResult<IMachine>> {
    return machineRepository.findAll(page, limit);
  },

  async findById(id: string): Promise<IMachine> {
    try {
      const machine = await machineRepository.findById(id);
      if (!machine) throw new AppError(404, 'Máquina no encontrada');
      return machine;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleMongooseError(err);
    }
  },

  async create(data: CreateMachineInput): Promise<IMachine> {
    const category = await machineCategoryRepository.findById(data.category);
    if (!category) throw new AppError(400, 'La categoría indicada no existe');

    try {
      return await machineRepository.create(data);
    } catch (err) {
      handleMongooseError(err);
    }
  },

  async update(id: string, data: UpdateMachineInput): Promise<IMachine> {
    if (data.category) {
      const category = await machineCategoryRepository.findById(data.category);
      if (!category) throw new AppError(400, 'La categoría indicada no existe');
    }

    try {
      const updated = await machineRepository.update(id, data);
      if (!updated) throw new AppError(404, 'Máquina no encontrada');
      return updated;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleMongooseError(err);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const deleted = await machineRepository.delete(id);
      if (!deleted) throw new AppError(404, 'Máquina no encontrada');
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleMongooseError(err);
    }
  },
};