//Recurso principal: Machine (máquina arcade)
// Entidades del dominio completo: machines, tokens, players, maintenance
// Esta semana trabajo con "machines".

export interface Machine {
  id: string;
  name: string;
  category: string; // ej: lucha, carreras, disparos, clasicos, baile, cabina
  price: number; // costo en fichas/tokens por partida
  stock: number; // unidades físicas disponibles en el local
  active: boolean; // true = operativa, false = en mantenimiento
}

//  procesador debe calcular
export interface MachineSummary {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
  mostExpensive: Machine;
  cheapest: Machine;
  categories: string[];
}

// Reporte final que se escribirá en output/report.json
export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: MachineSummary;
  items: Machine[];
}