import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';
import { ErrorResponse, ValidationErrorResponse } from '../types';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isProduction = process.env['NODE_ENV'] === 'production';

  // 1. Errores de validación de Zod
  if (err instanceof ZodError) {
    const response: ValidationErrorResponse = {
      error: 'Validation Error',
      message: 'Datos de entrada inválidos',
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
      })),
    };
    res.status(400).json(response);
    return;
  }

  // 2. Errores de dominio (operacionales)
  if (err instanceof AppError) {
    logger.warn(`AppError ${err.statusCode}: ${err.message}`);
    const response: ErrorResponse = {
      error: 'Application Error',
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // 3. Error genérico / no controlado
  const message = err instanceof Error ? err.message : 'Error desconocido';
  const stack = err instanceof Error ? err.stack : undefined;
  logger.error(`Unhandled error: ${message}`);

  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: 'Ha ocurrido un error inesperado',
    ...(isProduction ? {} : { stack }),
  };
  res.status(500).json(response);
}