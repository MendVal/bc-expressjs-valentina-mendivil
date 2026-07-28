import { readMachines } from './reader.js';
import { filterByCategory, calculateSummary } from './processor.js';
import { writeReport } from './writer.js';
import type { Report } from './types.js';

function parseCategoryArg(): string | null {
  const args = process.argv.slice(2);
  const categoryIndex = args.indexOf('--category');
  return categoryIndex !== -1 ? args[categoryIndex + 1] : null;
}

async function main(): Promise<void> {
  try {
    const categoryFilter = parseCategoryArg();

    const allMachines = await readMachines();
    const filteredMachines = filterByCategory(allMachines, categoryFilter);
    const summary = calculateSummary(filteredMachines);

    const report: Report = {
      generatedAt: new Date().toISOString(),
      appliedFilter: categoryFilter,
      summary,
      items: filteredMachines,
    };

    console.log(' Reporte de la Sala de Videojuegos (Arcade)');
    console.log('----------------------------------------------');
    console.log(`Filtro aplicado: ${categoryFilter ?? '(ninguno)'}`);
    console.log(`Total de máquinas: ${summary.total}`);
    console.log(`Operativas: ${summary.active} | En mantenimiento: ${summary.inactive}`);
    console.log(`Precio promedio por partida: $${summary.averagePrice}`);
    console.log(`Más cara: ${summary.mostExpensive.name} ($${summary.mostExpensive.price})`);
    console.log(`Más barata: ${summary.cheapest.name} ($${summary.cheapest.price})`);
    console.log(`Categorías: ${summary.categories.join(', ')}`);

    await writeReport(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n Error: ${message}`);
    process.exit(1);
  }
}

main();