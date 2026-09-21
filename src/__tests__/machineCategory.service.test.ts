jest.mock('../repositories/machineCategory.repository');

import { machineCategoryRepository } from '../repositories/machineCategory.repository';
import { machineCategoryService } from '../services/machineCategory.service';
import { CreateMachineCategoryInput, UpdateMachineCategoryInput } from '../schemas/machineCategory.schema';

const mockFindAll = machineCategoryRepository.findAll as jest.MockedFunction<typeof machineCategoryRepository.findAll>;
const mockFindById = machineCategoryRepository.findById as jest.MockedFunction<typeof machineCategoryRepository.findById>;
const mockCreate = machineCategoryRepository.create as jest.MockedFunction<typeof machineCategoryRepository.create>;
const mockUpdate = machineCategoryRepository.update as jest.MockedFunction<typeof machineCategoryRepository.update>;
const mockDelete = machineCategoryRepository.delete as jest.MockedFunction<typeof machineCategoryRepository.delete>;

const categoryBase = {
  _id: 'category-id-123',
  name: 'Arcade Clásico',
  description: 'Máquinas retro',
  createdAt: new Date(),
  updatedAt: new Date(),
} as any;

describe('MachineCategoryService — Unit Tests', () => {
  describe('findAll()', () => {
    it('should return all categories', async () => {
      mockFindAll.mockResolvedValue([categoryBase]);
      const result = await machineCategoryService.findAll();
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no categories exist', async () => {
      mockFindAll.mockResolvedValue([]);
      const result = await machineCategoryService.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findById()', () => {
    it('should return the category when found', async () => {
      mockFindById.mockResolvedValue(categoryBase);
      const result = await machineCategoryService.findById('category-id-123');
      expect(result).toEqual(categoryBase);
    });

    it('should throw AppError 404 when category does not exist', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(machineCategoryService.findById('nope')).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw AppError 400 on invalid id (CastError)', async () => {
      mockFindById.mockRejectedValue({ name: 'CastError' });
      await expect(machineCategoryService.findById('bad-id')).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('create()', () => {
    const dto = { name: 'Arcade Clásico' } as CreateMachineCategoryInput;

    it('should create and return the new category', async () => {
      mockCreate.mockResolvedValue(categoryBase);
      const result = await machineCategoryService.create(dto);
      expect(result).toEqual(categoryBase);
      expect(mockCreate).toHaveBeenCalledWith(dto);
    });

    it('should throw AppError 409 on duplicate name', async () => {
      mockCreate.mockRejectedValue({ code: 11000 });
      await expect(machineCategoryService.create(dto)).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('update()', () => {
    it('should update and return the category', async () => {
      mockUpdate.mockResolvedValue({ ...categoryBase, name: 'Actualizado' });
      const result = await machineCategoryService.update('category-id-123', { name: 'Actualizado' } as UpdateMachineCategoryInput);
      expect(result.name).toBe('Actualizado');
    });

    it('should throw AppError 404 when category does not exist', async () => {
      mockUpdate.mockResolvedValue(null);
      await expect(
        machineCategoryService.update('nope', { name: 'X' } as UpdateMachineCategoryInput),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw AppError 409 on duplicate name', async () => {
      mockUpdate.mockRejectedValue({ code: 11000 });
      await expect(
        machineCategoryService.update('category-id-123', { name: 'X' } as UpdateMachineCategoryInput),
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('delete()', () => {
    it('should delete without throwing when category exists', async () => {
      mockDelete.mockResolvedValue(categoryBase);
      await expect(machineCategoryService.delete('category-id-123')).resolves.toBeUndefined();
    });

    it('should throw AppError 404 when category does not exist', async () => {
      mockDelete.mockResolvedValue(null);
      await expect(machineCategoryService.delete('nope')).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});

export {};