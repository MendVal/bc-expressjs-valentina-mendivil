import { Router } from 'express';
import * as store from '../store';
import type { CreateMachineDto, UpdateMachineDto } from '../types';
import { REQUIRED_FIELDS } from '../types';

export const machinesRouter = Router();


function validarCamposRequeridos(body: Record<string, unknown>): string[] {
  return REQUIRED_FIELDS.filter((field) => body[field] === undefined);
}

// GET /machines — Listar todas las máquinas
// Status: 200
machinesRouter.get('/', (_req, res) => {
  res.status(200).json(store.getAll());
});

// GET /machines/:id — Obtener máquina por ID
// Status: 200 si existe | 404 si no existe
machinesRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const machine = store.getById(id);

  if (!machine) {
    res.status(404).json({ error: `No existe una máquina con id ${id}` });
    return;
  }

  res.status(200).json(machine);
});

// POST /machines — Crear nueva máquina
// Status: 201 con el recurso creado | 400 si faltan campos requeridos
machinesRouter.post('/', (req, res) => {
  const missing = validarCamposRequeridos(req.body ?? {});

  if (missing.length > 0) {
    res.status(400).json({
      error: 'Faltan campos requeridos',
      camposFaltantes: missing,
    });
    return;
  }

  const dto = req.body as CreateMachineDto;
  const newMachine = store.create(dto);
  res.status(201).json(newMachine);
});

// PUT /machines/:id — Actualizar máquina completa
// Status: 200 con el recurso actualizado | 404 si no existe | 400 si faltan campos
machinesRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const missing = validarCamposRequeridos(req.body ?? {});

  if (missing.length > 0) {
    res.status(400).json({
      error: 'Faltan campos requeridos',
      camposFaltantes: missing,
    });
    return;
  }

  const dto = req.body as UpdateMachineDto;
  const updated = store.update(id, dto);

  if (!updated) {
    res.status(404).json({ error: `No existe una máquina con id ${id}` });
    return;
  }

  res.status(200).json(updated);
});

// DELETE /machines/:id — Eliminar máquina
// Status: 204 sin body | 404 si no existe
machinesRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const deleted = store.remove(id);

  if (!deleted) {
    res.status(404).json({ error: `No existe una máquina con id ${id}` });
    return;
  }

  res.status(204).send();
});