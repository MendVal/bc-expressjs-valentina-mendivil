import { z } from 'zod';

export const createMachineSchema = z.object({
  name: z
    .string({ error: 'name es obligatorio' })
    .min(1, 'name no puede estar vacío')
    .trim(),
  serialCode: z
    .string({ error: 'serialCode es obligatorio' })
    .min(1, 'serialCode no puede estar vacío')
    .trim(),
  price: z
    .number({ error: 'price es obligatorio' })
    .positive('price debe ser mayor a 0'),
  stock: z
    .number()
    .int('stock debe ser entero')
    .nonnegative('stock no puede ser negativo')
    .default(0),
  active: z.boolean().default(true),
  categoryId: z
    .number({ error: 'categoryId es obligatorio' })
    .int('categoryId debe ser un entero')
    .positive('categoryId debe ser positivo'),
});

export const updateMachineSchema = createMachineSchema.partial();

export type CreateMachineDto = z.infer<typeof createMachineSchema>;
export type UpdateMachineDto = z.infer<typeof updateMachineSchema>;