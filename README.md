# 🎮 Semana 04 — Validación, Errores y Logging

**Dominio asignado:** Sala de videojuegos / Arcade

**Recurso principal:** `Machine` (máquina arcade)

## Campos del recurso

| Campo | Tipo | Validación |
|---|---|---|
| `name` | string | obligatorio, no vacío |
| `category` | enum | uno de: lucha, carreras, clasicos, disparos, baile, cabina |
| `price` | number | obligatorio, mayor a 0 |
| `stock` | number | entero, no negativo, default 0 |
| `active` | boolean | default true |

Schemas en `src/schemas/machine.schema.ts` con Zod (`createMachineSchema` y `updateMachineSchema` vía `.partial()`), tipos inferidos con `z.infer<>`.

## Manejo de errores

- `AppError` (`src/errors/AppError.ts`): extiende `Error`, con `statusCode` e `isOperational`.
- `notFound` (`src/middlewares/notFound.ts`): captura rutas no registradas → 404.
- `errorHandler` (`src/middlewares/errorHandler.ts`): 4 parámetros, distingue `ZodError` (400), `AppError` (statusCode propio) y errores genéricos (500, sin stack en producción).

## Logging

- Winston configurado en `src/config/logger.ts`: nivel `http` en desarrollo, `warn` en producción; formato colorizado en dev, JSON en producción; archivo `logs/error.log` solo en producción.
- Morgan integrado como middleware, escribe hacia `logger.http()`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/machines` | Listar con paginación (`?page&limit`) |
| GET | `/api/v1/machines/:id` | Obtener por id |
| POST | `/api/v1/machines` | Crear (valida con Zod) |
| PUT | `/api/v1/machines/:id` | Actualizar parcial |
| DELETE | `/api/v1/machines/:id` | Eliminar |

## Cómo ejecutar

```bash
pnpm install
pnpm dev      
pnpm build    
pnpm start    
```

## Capturas

Ver carpeta `capturas/`: validación 400 con issues, id no numérico, 404 recurso inexistente, 404 de ruta inexistente y logs en consola.