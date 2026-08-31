import { Machine, IMachine } from '../models/machine.model';
import { CreateMachineInput, UpdateMachineInput } from '../schemas/machine.schema';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const machineRepository = {
  async findAll(page: number, limit: number): Promise<PaginatedResult<IMachine>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Machine.find().populate('category').skip(skip).limit(limit).lean(),
      Machine.countDocuments(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string): Promise<IMachine | null> {
    return Machine.findById(id).populate('category').lean();
  },

  async create(data: CreateMachineInput): Promise<IMachine> {
    return Machine.create(data);
  },

  async update(id: string, data: UpdateMachineInput): Promise<IMachine | null> {
    return Machine.findByIdAndUpdate(id, data, { new: true }).populate('category').lean();
  },

  async delete(id: string): Promise<IMachine | null> {
    return Machine.findByIdAndDelete(id).lean();
  },
};