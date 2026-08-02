

export interface Machine {
  id: number;
  name: string; // nombre del juego, ej. "Pac-Man"
  category: string; // lucha, carreras, disparos, clasicos, baile, cabina
  price: number; // costo en fichas por partida
  stock: number; // unidades físicas en el local
  active: boolean; // true = operativa, false = en mantenimiento
}

// DTO para crear una máquina (sin id, se genera automáticamente)
export type CreateMachineDto = Omit<Machine, 'id'>;

// DTO para actualización (todos los campos editables, opcionales)
export type UpdateMachineDto = Partial<CreateMachineDto>;

// Campos obligatorios al crear una máquina — usado para la validación básica
export const REQUIRED_FIELDS: (keyof CreateMachineDto)[] = [
  'name',
  'category',
  'price',
  'stock',
  'active',
];