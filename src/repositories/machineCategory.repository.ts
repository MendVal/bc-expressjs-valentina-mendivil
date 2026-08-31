import { MachineCategory, IMachineCategory } from '../models/machineCategory.model';
import { CreateMachineCategoryInput, UpdateMachineCategoryInput } from '../schemas/machineCategory.schema';

export const machineCategoryRepository = {
  async findAll(): Promise<IMachineCategory[]> {
    return MachineCategory.find().lean();
  },

  async findById(id: string): Promise<IMachineCategory | null> {
    return MachineCategory.findById(id).lean();
  },

  async create(data: CreateMachineCategoryInput): Promise<IMachineCategory> {
    return MachineCategory.create(data);
  },

  async update(id: string, data: UpdateMachineCategoryInput): Promise<IMachineCategory | null> {
    return MachineCategory.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  async delete(id: string): Promise<IMachineCategory | null> {
    return MachineCategory.findByIdAndDelete(id).lean();
  },
};