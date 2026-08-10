import { CreateMachineDto, UpdateMachineDto, Machine, PaginatedResponse, PaginationParams } from '../types';
import * as repo from '../repositories/machines.repository';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<Machine>> {
  const { page, limit } = params;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Machine | undefined> {
  return repo.findById(id);
}

export async function create(dto: CreateMachineDto): Promise<Machine> {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateMachineDto): Promise<Machine | undefined> {
  const exists = await repo.findById(id);
  if (!exists) {
    return undefined;
  }
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
  const exists = await repo.findById(id);
  if (!exists) {
    return false;
  }
  return repo.remove(id);
}