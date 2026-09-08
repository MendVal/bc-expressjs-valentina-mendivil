# 🎮  Semana 07 — Autenticación JWT con MongoDB + Mongoose

## Dominio: Sala de videojuegos / Arcade

Este proyecto expone una API REST para gestionar las máquinas de una sala de videojuegos (arcade), usando MongoDB como base de datos, Mongoose como ODM, y autenticación basada en JWT (access + refresh tokens) mediante cookies httpOnly.

## Entidades

### User (autenticación)
Representa un usuario que puede autenticarse y acceder a los recursos protegidos de la API.

| Campo | Tipo | Descripción |
|---|---|---|
| email | String | Único, usado como identificador de login |
| password | String | Hash con bcrypt (nunca se devuelve en las respuestas) |
| name | String | Nombre del usuario |
| role | String (enum) | `user`, `admin` |
| refreshToken | String | Hash del refresh token vigente (nunca se devuelve en las respuestas) |

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

## Autenticación

La API usa **JWT con dos tokens**, entregados como cookies `httpOnly`:

- **Access token** — vida corta (15 minutos), se usa para autorizar cada request.
- **Refresh token** — vida larga (7 días), se usa únicamente para renovar el access token. Se almacena hasheado (bcrypt) en la base de datos y **rota** en cada uso (se invalida el anterior y se emite uno nuevo).

Todas las rutas de `machines` y `machine-categories` requieren estar autenticado.

### Endpoints (`/api/v1/auth`)
| Método | Ruta | Auth requerida | Descripción |
|---|---|---|---|
| POST | `/register` | No | Registra un usuario nuevo (hashea la contraseña) |
| POST | `/login` | No | Verifica credenciales y entrega cookies `accessToken` + `refreshToken` |
| POST | `/refresh` | No (requiere cookie refreshToken) | Rota ambos tokens |
| GET | `/me` | Sí | Devuelve el usuario autenticado |
| POST | `/logout` | Sí | Invalida el refresh token y limpia las cookies |

## Endpoints

### Categorías (`/api/v1/machine-categories`) — 🔒 requiere autenticación
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Listar todas las categorías |
| GET | `/:id` | Obtener una categoría por ID |
| POST | `/` | Crear categoría |
| PUT | `/:id` | Actualizar categoría |
| DELETE | `/:id` | Eliminar categoría |

### Máquinas (`/api/v1/machines`) — 🔒 requiere autenticación
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
| No autenticado (sin cookie o token inválido/expirado) | 401 |
| Credenciales inválidas en login | 401 |
| Email ya registrado | 409 |
| ID con formato inválido (CastError) | 400 |
| Categoría referenciada no existe | 400 |
| Recurso no encontrado | 404 |
| Nombre de categoría duplicado (índice unique, error 11000) | 409 |

## Variables de entorno

```bash
MONGODB_URI=mongodb://usuario:password@localhost:27017/arcade_dev?authSource=admin
PORT=3000
NODE_ENV=development
JWT_ACCESS_SECRET=tu-secreto-para-access-token
JWT_REFRESH_SECRET=tu-secreto-para-refresh-token
```

## Cómo correr el proyecto

```bash
docker compose up -d
pnpm install
pnpm seed
pnpm dev
```

## Stack

Express 5, TypeScript, Mongoose, Zod, JWT (jsonwebtoken), bcrypt, cookie-parser, MongoDB 7 (Docker)