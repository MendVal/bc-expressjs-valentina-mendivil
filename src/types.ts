export interface Machine {
  id: number;
  name: string; // nombre del juego, ej. "Pac-Man"
  category: string; // lucha, carreras, disparos, clasicos, baile, cabina
  price: number; // costo en fichas por partida
  stock: number; // unidades físicas en el local
  active: boolean; // true = operativa, false = en mantenimiento
  createdAt: string;
}

// DTO para crear — sin campos auto-generados
export type CreateMachineDto = Omit<Machine, 'id' | 'createdAt'>;

// DTO para actualizar — todos los campos opcionales
export type UpdateMachineDto = Partial<CreateMachineDto>;

// Contratos de respuesta (nombres genéricos exigidos por la especificación)
export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}