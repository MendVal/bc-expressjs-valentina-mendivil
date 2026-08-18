import { z } from 'zod';

const CATEGORIES = ['lucha', 'carreras', 'clasicos', 'disparos', 'baile', 'cabina'] as const;

export const createMachineSchema = z.object({
  name: z
    .string({ error: 'name es obligatorio' })
    .min(1, 'name no puede estar vacío')
    .trim(),
  category: z.enum(CATEGORIES, {
    error: `category debe ser una de: ${CATEGORIES.join(', ')}`,
  }),
  price: z
    .number({ error: 'price es obligatorio' })
    .positive('price debe ser mayor a 0'),
  stock: z
    .number()
    .int('stock debe ser entero')
    .nonnegative('stock no puede ser negativo')
    .default(0),
  active: z.boolean().default(true),
});

// Reutiliza el schema de creación con .partial() — sin duplicar código
export const updateMachineSchema = createMachineSchema.partial();

// Tipos inferidos desde los schemas (single source of truth)
export type CreateMachineDto = z.infer<typeof createMachineSchema>;
export type UpdateMachineDto = z.infer<typeof updateMachineSchema>;