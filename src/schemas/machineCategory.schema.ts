import { z } from 'zod';

export const createMachineCategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
});

export const updateMachineCategorySchema = createMachineCategorySchema.partial();

export type CreateMachineCategoryInput = z.infer<typeof createMachineCategorySchema>;
export type UpdateMachineCategoryInput = z.infer<typeof updateMachineCategorySchema>;