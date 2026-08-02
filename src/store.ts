import type { Machine, CreateMachineDto, UpdateMachineDto } from './types';

// Store en memoria — simula una base de datos sin persistencia

const machines: Machine[] = [
  { id: 1, name: 'Street Fighter II', category: 'lucha', price: 2.5, stock: 3, active: true },
  { id: 2, name: 'Daytona USA', category: 'carreras', price: 3.5, stock: 2, active: true },
  { id: 3, name: 'Pac-Man', category: 'clasicos', price: 1.5, stock: 4, active: true },
];
let nextId = 4;

export function getAll(): Machine[] {
  return machines;
}

export function getById(id: number): Machine | undefined {
  return machines.find((machine) => machine.id === id);
}

export function create(data: CreateMachineDto): Machine {
  const newMachine: Machine = { id: nextId++, ...data };
  machines.push(newMachine);
  return newMachine;
}

export function update(id: number, data: UpdateMachineDto): Machine | undefined {
  const index = machines.findIndex((machine) => machine.id === id);
  if (index === -1) {
    return undefined;
  }
  machines[index] = { ...machines[index], ...data };
  return machines[index];
}

export function remove(id: number): boolean {
  const index = machines.findIndex((machine) => machine.id === id);
  if (index === -1) {
    return false;
  }
  machines.splice(index, 1);
  return true;
}