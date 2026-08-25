import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isProduction = process.env['NODE_ENV'] === 'production';

  // 1. Errores de validación de Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Datos de entrada inválidos',
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
      })),
    });
    return;
  }

  // 2. Traducir errores conocidos de Prisma a AppError
  let error: unknown = err;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      error = new AppError(404, 'Recurso no encontrado');
    } else if (err.code === 'P2002') {
      const fields = (err.meta?.['target'] as string[] | undefined)?.join(', ') ?? 'campo único';
      error = new AppError(409, `Ya existe un registro con ese valor (${fields})`);
    }
  }

  // 3. Errores de dominio (AppError, incluye los traducidos de Prisma)
  if (error instanceof AppError) {
    logger.warn(`AppError ${error.statusCode}: ${error.message}`);
    res.status(error.statusCode).json({ error: 'Application Error', message: error.message });
    return;
  }

  // 4. Error genérico / no controlado
  const message = error instanceof Error ? error.message : 'Error desconocido';
  const stack = error instanceof Error ? error.stack : undefined;
  logger.error(`Unhandled error: ${message}`);

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ha ocurrido un error inesperado',
    ...(isProduction ? {} : { stack }),
  });
}