import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { MachineCategory } from './models/machineCategory.model';
import { Machine } from './models/machine.model';

async function seed(): Promise<void> {
  await connectDB();

  console.log('Limpiando colecciones...');
  await Machine.deleteMany({});
  await MachineCategory.deleteMany({});

  console.log('Insertando categorías...');
  const categories = await MachineCategory.insertMany([
    { name: 'Arcade Clásico', description: 'Máquinas de estilo retro, un solo jugador o versus local' },
    { name: 'Simuladores', description: 'Máquinas de carreras, vuelo u otros simuladores' },
    { name: 'Bailables', description: 'Máquinas de baile y ritmo' },
    { name: 'Grúas y Premios', description: 'Máquinas de agarre y expendedoras de premios' },
  ]);

  console.log('Insertando máquinas...');
  await Machine.insertMany([
    {
      name: 'Street Fighter II',
      category: categories[0]._id,
      tokenCost: 3,
      status: 'available',
      location: 'Pasillo A - Puesto 1',
    },
    {
      name: 'Pac-Man',
      category: categories[0]._id,
      tokenCost: 2,
      status: 'available',
      location: 'Pasillo A - Puesto 2',
    },
    {
      name: 'Initial D Arcade Stage',
      category: categories[1]._id,
      tokenCost: 5,
      status: 'in_use',
      location: 'Pasillo B - Puesto 1',
    },
    {
      name: 'Time Crisis',
      category: categories[1]._id,
      tokenCost: 4,
      status: 'available',
      location: 'Pasillo B - Puesto 2',
    },
    {
      name: 'Dance Dance Revolution',
      category: categories[2]._id,
      tokenCost: 4,
      status: 'maintenance',
      location: 'Pasillo C - Puesto 1',
    },
    {
      name: 'Garra Mágica',
      category: categories[3]._id,
      tokenCost: 2,
      status: 'available',
      location: 'Entrada - Puesto 1',
    },
  ]);

  console.log('Seed completado ✅');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});