jest.mock('../repositories/machine.repository');
jest.mock('../repositories/machineCategory.repository');

import { machineRepository } from '../repositories/machine.repository';
import { machineCategoryRepository } from '../repositories/machineCategory.repository';
import { machineService } from '../services/machine.service';
import { CreateMachineInput, UpdateMachineInput } from '../schemas/machine.schema';

const mockFindAll = machineRepository.findAll as jest.MockedFunction<typeof machineRepository.findAll>;
const mockFindById = machineRepository.findById as jest.MockedFunction<typeof machineRepository.findById>;
const mockCreate = machineRepository.create as jest.MockedFunction<typeof machineRepository.create>;
const mockUpdate = machineRepository.update as jest.MockedFunction<typeof machineRepository.update>;
const mockDelete = machineRepository.delete as jest.MockedFunction<typeof machineRepository.delete>;
const mockCategoryFindById = machineCategoryRepository.findById as jest.MockedFunction<typeof machineCategoryRepository.findById>;

const machineBase = {
  _id: 'machine-id-123',
  name: 'Pac-Man Cabinet',
  category: 'category-id-abc',
  createdAt: new Date(),
  updatedAt: new Date(),
} as any;

describe('MachineService — Unit Tests', () => {
  describe('findAll()', () => {
    it('should return paginated machines', async () => {
      mockFindAll.mockResolvedValue({ data: [machineBase], total: 1, page: 1, totalPages: 1 });
      const result = await machineService.findAll(1, 10);
      expect(result.data).toHaveLength(1);
      expect(mockFindAll).toHaveBeenCalledWith(1, 10);
    });

    it('should return empty data when no machines exist', async () => {
      mockFindAll.mockResolvedValue({ data: [], total: 0, page: 1, totalPages: 0 });
      const result = await machineService.findAll(1, 10);
      expect(result.data).toEqual([]);
    });
  });

  describe('findById()', () => {
    it('should return the machine when found', async () => {
      mockFindById.mockResolvedValue(machineBase);
      const result = await machineService.findById('machine-id-123');
      expect(result).toEqual(machineBase);
    });

    it('should throw AppError 404 when machine does not exist', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(machineService.findById('nope')).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw AppError 400 on invalid id (CastError)', async () => {
      mockFindById.mockRejectedValue({ name: 'CastError' });
      await expect(machineService.findById('bad-id')).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('create()', () => {
    const dto = { name: 'Pac-Man Cabinet', category: 'category-id-abc' } as CreateMachineInput;

    it('should create and return the new machine when category exists', async () => {
      mockCategoryFindById.mockResolvedValue({ _id: 'category-id-abc' } as any);
      mockCreate.mockResolvedValue(machineBase);
      const result = await machineService.create(dto);
      expect(result).toEqual(machineBase);
      expect(mockCreate).toHaveBeenCalledWith(dto);
    });

    it('should throw AppError 400 when category does not exist', async () => {
      mockCategoryFindById.mockResolvedValue(null);
      await expect(machineService.create(dto)).rejects.toMatchObject({ statusCode: 400 });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should throw AppError 409 on duplicate key error', async () => {
      mockCategoryFindById.mockResolvedValue({ _id: 'category-id-abc' } as any);
      mockCreate.mockRejectedValue({ code: 11000 });
      await expect(machineService.create(dto)).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('update()', () => {
    it('should update and return the machine (no category change)', async () => {
      mockUpdate.mockResolvedValue({ ...machineBase, name: 'Updated' });
      const result = await machineService.update('machine-id-123', { name: 'Updated' } as UpdateMachineInput);
      expect(result.name).toBe('Updated');
    });

    it('should throw AppError 400 when new category does not exist', async () => {
      mockCategoryFindById.mockResolvedValue(null);
      await expect(
        machineService.update('machine-id-123', { category: 'bad-category' } as UpdateMachineInput),
      ).rejects.toMatchObject({ statusCode: 400 });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when machine does not exist', async () => {
      mockUpdate.mockResolvedValue(null);
      await expect(
        machineService.update('nope', { name: 'X' } as UpdateMachineInput),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('delete()', () => {
    it('should delete without throwing when machine exists', async () => {
      mockDelete.mockResolvedValue(machineBase);
      await expect(machineService.delete('machine-id-123')).resolves.toBeUndefined();
    });

    it('should throw AppError 404 when machine does not exist', async () => {
      mockDelete.mockResolvedValue(null);
      await expect(machineService.delete('nope')).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});

export {};