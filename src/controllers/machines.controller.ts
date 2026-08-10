import { Request, Response, NextFunction } from 'express';
import * as service from '../services/machines.service';
import { CreateMachineDto, UpdateMachineDto, ErrorResponse } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer page y limit de req.query (con fallbacks 1 y 10)
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;

    // Paso 2 — llamar service.findAll({ page, limit })
    const result = await service.findAll({ page, limit });

    // Paso 3 — responder
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer id de req.params, parsearlo a número
    const id = Number(req.params['id']);

    // Paso 2 — llamar service.findById(id)
    const machine = await service.findById(id);

    // Paso 3 — responder
    if (!machine) {
      const response: ErrorResponse = { error: 'Not Found', message: `Machine ${id} not found` };
      res.status(404).json(response);
      return;
    }
    res.json({ data: machine });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
    const dto = req.body as CreateMachineDto;

    
    const machine = await service.create(dto);

    
    res.status(201).json({ data: machine });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer id de params y dto del body
    const id = Number(req.params['id']);
    const dto = req.body as UpdateMachineDto;

    // Paso 2 — llamar service.update(id, dto)
    const machine = await service.update(id, dto);

    // Paso 3 — responder
    if (!machine) {
      const response: ErrorResponse = { error: 'Not Found', message: `Machine ${id} not found` };
      res.status(404).json(response);
      return;
    }
    res.json({ data: machine });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer id de params
    const id = Number(req.params['id']);

    // Paso 2 — llamar service.remove(id)
    const deleted = await service.remove(id);

    // Paso 3 — responder
    if (!deleted) {
      const response: ErrorResponse = { error: 'Not Found', message: `Machine ${id} not found` };
      res.status(404).json(response);
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}