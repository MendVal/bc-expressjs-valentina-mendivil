// ============================================
// REPOSITORY — capa de acceso a datos con Prisma
// ============================================
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CreateMachineDto, UpdateMachineDto } from '../schemas/machine.schema';

export async function findAll(skip: number, take: number) {
  const [data, total] = await Promise.all([
    prisma.machine.findMany({
      skip,
      take,
      orderBy: { id: 'asc' },
      include: { category: true },
    }),
    prisma.machine.count(),
  ]);
  return { data, total };
}

export async function findById(id: number) {
  return prisma.machine.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function create(dto: CreateMachineDto) {
  return prisma.machine.create({
    data: dto satisfies Prisma.MachineUncheckedCreateInput,
    include: { category: true },
  });
}

export async function update(id: number, dto: UpdateMachineDto) {
  return prisma.machine.update({
    where: { id },
    data: dto satisfies Prisma.MachineUncheckedUpdateInput,
    include: { category: true },
  });
}

export async function remove(id: number): Promise<void> {
  await prisma.machine.delete({ where: { id } });
}