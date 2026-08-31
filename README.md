# 🎮  Semana 06 — API REST Arcade con MongoDB + Mongoose

## Dominio: Sala de videojuegos / Arcade

Este proyecto expone una API REST para gestionar las máquinas de una sala de videojuegos (arcade), usando MongoDB como base de datos y Mongoose como ODM.

## Entidades

### MachineCategory (secundaria)
Representa el tipo o categoría de una máquina (ej. Arcade Clásico, Simuladores, Bailables, Grúas y Premios).

| Campo | Tipo | Descripción |
|---|---|---|
| name | String | Nombre único de la categoría |
| description | String | Descripción opcional |

### Machine (principal)
Representa una máquina física del arcade. Cada máquina pertenece a una categoría.

| Campo | Tipo | Descripción |
|---|---|---|
| name | String | Nombre de la máquina |
| category | ObjectId (ref: MachineCategory) | Categoría a la que pertenece |
| tokenCost | Number | Costo en fichas para jugar |
| status | String (enum) | `available`, `in_use`, `maintenance` |
| location | String | Ubicación física en el local |

**Relación:** `Machine.category` referencia a `MachineCategory._id`. Al consultar máquinas (`GET /machines` y `GET /machines/:id`), el campo `category` se devuelve **populado** (objeto completo de la categoría, no solo el ID).

## Endpoints

### Categorías (`/api/v1/machine-categories`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Listar todas las categorías |
| GET | `/:id` | Obtener una categoría por ID |
| POST | `/` | Crear categoría |
| PUT | `/:id` | Actualizar categoría |
| DELETE | `/:id` | Eliminar categoría |

### Máquinas (`/api/v1/machines`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/?page=1&limit=10` | Listar con paginación y populate de categoría |
| GET | `/:id` | Obtener por ID con populate de categoría |
| POST | `/` | Crear (valida que la categoría exista) |
| PUT | `/:id` | Actualizar |
| DELETE | `/:id` | Eliminar |

## Manejo de errores

| Situación | Código |
|---|---|
| ID con formato inválido (CastError) | 400 |
| Categoría referenciada no existe | 400 |
| Recurso no encontrado | 404 |
| Nombre de categoría duplicado (índice unique, error 11000) | 409 |

## Cómo correr el proyecto

```bash
docker compose up -d
pnpm install
pnpm seed
pnpm dev
```

## Stack

Express 5, TypeScript, Mongoose, Zod, MongoDB 7 (Docker)