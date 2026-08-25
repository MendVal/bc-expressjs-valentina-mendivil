# 🎮 # Semana 05 — PostgreSQL + Prisma ORM

**Dominio asignado:** Sala de videojuegos / Arcade

**Recurso principal:** `Machine` (máquina arcade)

**Recurso secundario:** `MachineCategory` (categoría, relación 1:N)

## Diagrama de entidades

MachineCategory (1) ──────< (N) Machine

| MachineCategory | Machine |
|---|---|
| id (PK) | id (PK) |
| name (unique) | name |
| createdAt | serialCode (unique) |
| | price |
| | stock |
| | active |
| | categoryId (FK → MachineCategory.id) |
| | createdAt |
| | updatedAt |

Una `MachineCategory` tiene muchas `Machine` (relación uno a muchos).

## Modelos (`prisma/schema.prisma`)

- `MachineCategory`: id, name (único), machines[], createdAt
- `Machine`: id, name, serialCode (único, para probar error P2002), price, stock, active, categoryId (FK), createdAt, updatedAt

## Manejo de errores Prisma

- `P2025` (registro no encontrado en update/delete) → `AppError(404)`
- `P2002` (serialCode duplicado) → `AppError(409)`
- Traducidos automáticamente en `src/middlewares/errorHandler.ts`

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/machines?page&limit` | Listado paginado (skip/take) |
| GET | `/api/v1/machines/:id` | Detalle con categoría incluida |
| POST | `/api/v1/machines` | Crear (valida con Zod) |
| PUT | `/api/v1/machines/:id` | Actualizar |
| DELETE | `/api/v1/machines/:id` | Eliminar |

### Ejemplo — POST /api/v1/machines

Request:

    { "name": "Galaga", "serialCode": "GAL-010", "price": 1.5, "stock": 5, "categoryId": 3 }

Response 201:

    {
      "data": {
        "id": 7,
        "name": "Galaga",
        "serialCode": "GAL-010",
        "price": 1.5,
        "stock": 5,
        "active": true,
        "categoryId": 3,
        "createdAt": "2026-08-25T02:00:00.000Z",
        "updatedAt": "2026-08-25T02:00:00.000Z",
        "category": { "id": 3, "name": "clasicos", "createdAt": "2026-08-25T01:51:24.963Z" }
      }
    }

### Ejemplo — GET /api/v1/machines/999 (id inexistente)

Response 404:

    { "error": "Not Found", "message": "Recurso no encontrado" }

### Ejemplo — POST con serialCode duplicado

Response 409:

    { "error": "Conflict", "message": "Ya existe un registro con ese valor (serialCode)" }

## Cómo ejecutar

    docker compose up -d
    pnpm install
    cp .env.example .env
    pnpm exec prisma migrate dev --name init
    pnpm exec prisma db seed
    pnpm dev

## Logs del seed

    🌱 Iniciando seed...
    ✅ 6 máquinas creadas
    ✅ 4 categorías creadas

## Capturas

Ver carpeta `capturas/`: listado paginado, detalle con relación, 404, creación 201, validación 400, conflicto 409, actualización, eliminación, logs de seed y consola, build sin errores.