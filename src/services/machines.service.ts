// ============================================
// SERVICE — lógica de negocio
// ============================================
import * as repo from '../repositories/machines.repository';
import { CreateMachineDto, UpdateMachineDto } from '../schemas/machine.schema';
import { AppError } from '../errors/AppError';

export async function findAll(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const { data, total } = await repo.findAll(skip, limit);
  return { data, total, page, limit };
}

export async function findById(id: number) {
  const machine = await repo.findById(id);
  if (!machine) {
    throw new AppError(404, `Machine ${id} not found`);
  }
  return machine;
}

export async function create(dto: CreateMachineDto) {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateMachineDto) {
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<void> {
  await repo.remove(id);
}