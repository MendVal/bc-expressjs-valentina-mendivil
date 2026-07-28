import type { Machine, MachineSummary } from './types.js';

export function filterByCategory(
  machines: Machine[],
  categoryFilter: string | null
): Machine[] {
  if (categoryFilter === null) {
    return machines;
  }

  const normalizedFilter = categoryFilter.toLowerCase();
  const filtered = machines.filter(
    (machine) => machine.category.toLowerCase() === normalizedFilter
  );

  if (filtered.length === 0) {
    const availableCategories = Array.from(
      new Set(machines.map((machine) => machine.category))
    );
    throw new Error(
      `No hay máquinas en la categoría "${categoryFilter}". ` +
        `Categorías disponibles: ${availableCategories.join(', ')}`
    );
  }

  return filtered;
}

export function calculateSummary(machines: Machine[]): MachineSummary {
  const total = machines.length;

  const active = machines.filter((machine) => machine.active).length;
  const inactive = total - active;

  const totalPrice = machines.reduce((sum, machine) => sum + machine.price, 0);
  const averagePrice = Number((totalPrice / total).toFixed(2));

  const sortedByPrice = [...machines].sort((a, b) => a.price - b.price);
  const cheapest = sortedByPrice[0];
  const mostExpensive = sortedByPrice[sortedByPrice.length - 1];

  const categories = Array.from(new Set(machines.map((m) => m.category)));

  return {
    total,
    active,
    inactive,
    averagePrice,
    mostExpensive,
    cheapest,
    categories,
  };
}