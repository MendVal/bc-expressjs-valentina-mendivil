

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Machine } from './types.js';

export async function readMachines(): Promise<Machine[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'machines.json');
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as Machine[];
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(
      `No se pudo leer el archivo de datos en "${filePath}". Detalle: ${reason}`
    );
  }
}