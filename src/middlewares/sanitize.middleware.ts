import { Request, Response, NextFunction } from 'express';

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      // elimina claves que empiecen con "$" o contengan "." (sintaxis de operadores Mongo)
      if (key.startsWith('$') || key.includes('.')) continue;
      clean[key] = sanitizeValue(val);
    }
    return clean;
  }
  return value;
}

export function sanitizeInputs(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.params) {
    req.params = sanitizeValue(req.params) as typeof req.params;
  }

  // req.query en Express 5 es de solo lectura como propiedad,
  // pero sus llaves internas sí se pueden mutar
  if (req.query) {
    const sanitizedQuery = sanitizeValue(req.query) as Record<string, unknown>;
    for (const key of Object.keys(req.query)) {
      delete (req.query as Record<string, unknown>)[key];
    }
    Object.assign(req.query, sanitizedQuery);
  }

  next();
}