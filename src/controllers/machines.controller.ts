
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as service from '../services/machines.service';
import { createMachineSchema, updateMachineSchema } from '../schemas/machine.schema';
import { SingleResponse, PaginatedResponse, ValidationErrorResponse } from '../types';

// Schema para validar el :id de la ruta
const idSchema = z.coerce.number().int().positive({
  message: 'El id debe ser un número entero positivo',
});

// Helper para no duplicar el formateo de issues de Zod
function formatIssues(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'id',
    message: issue.message,
  }));
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const result = await service.findAll({ page, limit });
    res.json(result satisfies PaginatedResponse<typeof result.data[number]>);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      const response: ValidationErrorResponse = {
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: formatIssues(parsedId.error),
      };
      res.status(400).json(response);
      return;
    }
    const machine = await service.findById(parsedId.data);
    res.json({ data: machine } satisfies SingleResponse<typeof machine>);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createMachineSchema.safeParse(req.body);
    if (!result.success) {
      const response: ValidationErrorResponse = {
        error: 'Validation Error',
        message: 'Datos de entrada inválidos',
        issues: formatIssues(result.error),
      };
      res.status(400).json(response);
      return;
    }
    const machine = await service.create(result.data);
    res.status(201).json({ data: machine } satisfies SingleResponse<typeof machine>);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      const response: ValidationErrorResponse = {
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: formatIssues(parsedId.error),
      };
      res.status(400).json(response);
      return;
    }
    const result = updateMachineSchema.safeParse(req.body);
    if (!result.success) {
      const response: ValidationErrorResponse = {
        error: 'Validation Error',
        message: 'Datos de entrada inválidos',
        issues: formatIssues(result.error),
      };
      res.status(400).json(response);
      return;
    }
    const machine = await service.update(parsedId.data, result.data);
    res.json({ data: machine } satisfies SingleResponse<typeof machine>);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      const response: ValidationErrorResponse = {
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: formatIssues(parsedId.error),
      };
      res.status(400).json(response);
      return;
    }
    await service.remove(parsedId.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}