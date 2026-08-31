import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createMachineSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().regex(objectIdRegex, 'ID de categoría inválido'),
  tokenCost: z.number().int().positive(),
  status: z.enum(['available', 'in_use', 'maintenance']).optional(),
  location: z.string().min(1),
});

export const updateMachineSchema = createMachineSchema.partial();

export type CreateMachineInput = z.infer<typeof createMachineSchema>;
export type UpdateMachineInput = z.infer<typeof updateMachineSchema>;