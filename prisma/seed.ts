// prisma/seed.ts — Datos iniciales del dominio arcade
// Ejecutar con: pnpm exec prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');

  // 1. Limpiar datos existentes (idempotencia)
  await prisma.machine.deleteMany();
  await prisma.machineCategory.deleteMany();

  // 2. Crear categorías primero (lado "1" de la relación)
  const [lucha, carreras, clasicos, disparos] = await Promise.all([
    prisma.machineCategory.create({ data: { name: 'lucha' } }),
    prisma.machineCategory.create({ data: { name: 'carreras' } }),
    prisma.machineCategory.create({ data: { name: 'clasicos' } }),
    prisma.machineCategory.create({ data: { name: 'disparos' } }),
  ]);

  // 3. Crear máquinas (lado "N"), referenciando las categorías
  const result = await prisma.machine.createMany({
    data: [
      { name: 'Street Fighter II', serialCode: 'SF2-001', price: 2.5, stock: 3, categoryId: lucha.id },
      { name: 'Mortal Kombat', serialCode: 'MK-002', price: 2.5, stock: 2, categoryId: lucha.id },
      { name: 'Daytona USA', serialCode: 'DAY-003', price: 3.5, stock: 2, categoryId: carreras.id },
      { name: 'Pac-Man', serialCode: 'PAC-004', price: 1.5, stock: 4, categoryId: clasicos.id },
      { name: 'Donkey Kong', serialCode: 'DK-005', price: 1.5, stock: 2, categoryId: clasicos.id },
      { name: 'Time Crisis', serialCode: 'TC-006', price: 3.0, stock: 0, categoryId: disparos.id, active: false },
    ],
  });

  console.log(` ${result.count} máquinas creadas`);
  console.log(` 4 categorías creadas`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });