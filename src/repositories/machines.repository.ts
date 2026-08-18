import { Machine } from '../types';
import { CreateMachineDto, UpdateMachineDto } from '../schemas/machine.schema';

const store: Machine[] = [
  {
    id: 1,
    name: 'Street Fighter II',
    category: 'lucha',
    price: 2.5,
    stock: 3,
    active: true,
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 2,
    name: 'Daytona USA',
    category: 'carreras',
    price: 3.5,
    stock: 2,
    active: true,
    createdAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: 3,
    name: 'Pac-Man',
    category: 'clasicos',
    price: 1.5,
    stock: 4,
    active: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 4,
    name: 'Time Crisis',
    category: 'disparos',
    price: 3.0,
    stock: 0,
    active: false,
    createdAt: new Date('2024-01-20').toISOString(),
  },
];
let nextId = 5;

export async function findAll(): Promise<Machine[]> {
  return [...store];
}

export async function findById(id: number): Promise<Machine | undefined> {
  const machine = store.find((item) => item.id === id);
  return machine ? { ...machine } : undefined;
}

export async function create(dto: CreateMachineDto): Promise<Machine> {
  const machine: Machine = { id: nextId++, ...dto, createdAt: new Date().toISOString() };
  store.push(machine);
  return { ...machine };
}

export async function update(id: number, dto: UpdateMachineDto): Promise<Machine | undefined> {
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}