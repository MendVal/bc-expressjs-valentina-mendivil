# 🎮  Semana 09 — Testing con Jest y Supertest

## Dominio: Sala de videojuegos / Arcade

Este proyecto expone una API REST para gestionar las máquinas de una sala de videojuegos (arcade), usando MongoDB como base de datos, Mongoose como ODM, autenticación JWT (access + refresh tokens vía cookies httpOnly), autorización basada en roles (RBAC), múltiples capas de seguridad (Helmet, CORS, rate limiting, sanitización de inputs) y una suite de tests automatizados con Jest + Supertest.

## Entidades

### User (autenticación y roles)
Representa un usuario que puede autenticarse y acceder a los recursos de la API según su rol.

| Campo | Tipo | Descripción |
|---|---|---|
| email | String | Único, usado como identificador de login |
| password | String | Hash con bcrypt (nunca se devuelve en las respuestas) |
| name | String | Nombre del usuario |
| role | String (enum) | `user`, `admin` — determina permisos de escritura |
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

- **Access token** — vida corta (15 minutos), incluye el `role` del usuario en su payload.
- **Refresh token** — vida larga (7 días), se usa únicamente para renovar el access token. Se almacena hasheado (bcrypt) en la base de datos y **rota** en cada uso.

## Autorización (RBAC)

| Rol | Puede leer (`GET`) | Puede crear/editar/eliminar (`POST`/`PUT`/`DELETE`) |
|---|---|---|
| `user` (por defecto) | ✅ Sí, en `machines` y `machine-categories` | ❌ No — devuelve 403 |
| `admin` | ✅ Sí | ✅ Sí |

El rol viaja en el payload del JWT y se valida en cada request mediante el middleware `requireRole('admin')`, aplicado después de `authMiddleware`.

## Capas de seguridad

| Capa | Herramienta | Configuración |
|---|---|---|
| Cabeceras HTTP seguras | `helmet` | Aplicado globalmente (CSP, HSTS, X-Frame-Options, etc.) |
| CORS | `cors` | Whitelist de orígenes explícitos (no `*`), `credentials: true` para cookies |
| Rate limiting global | `express-rate-limit` | 100 solicitudes / 15 min en toda la API |
| Rate limiting en auth | `express-rate-limit` | 5 solicitudes / 15 min en `/register` y `/login` (anti fuerza bruta) |
| Sanitización de inputs | Middleware propio (`sanitizeInputs`) | Elimina claves con `$` o `.` de `body`, `params` y `query` para prevenir NoSQL injection |
| Validación de tipos | `zod` | Rechaza payloads con tipos incorrectos (ej. objetos en campos que esperan string) antes de llegar a la base de datos |

**Nota técnica:** se implementó un middleware de sanitización propio en lugar de `express-mongo-sanitize`, ya que esa librería no es compatible con Express 5 (intenta reescribir `req.query`, que en Express 5 es de solo lectura).

## Testing

Suite completa de tests automatizados con **Jest + ts-jest + Supertest**, cubriendo unit tests (lógica de negocio aislada, con mocks del repositorio) e integration tests (ciclo HTTP completo, contra una base MongoDB de pruebas).

| Archivo | Tipo | Qué cubre |
|---|---|---|
| `machine.service.test.ts` | Unit | CRUD de `machine.service.ts` — happy path y errores (404, 400, 409) con repositorio mockeado |
| `machineCategory.service.test.ts` | Unit | CRUD de `machineCategory.service.ts` — happy path y errores |
| `auth.service.test.ts` | Unit | Registro, login, refresh (rotación de tokens), logout, getMe — con `bcrypt`, `jwt` y repositorio mockeados |
| `machine.routes.test.ts` | Integration | Rutas `/api/v1/machines` — 200/201/401/403/404/400 según rol y validación |
| `machineCategory.routes.test.ts` | Integration | Rutas `/api/v1/machine-categories` — mismos casos que machines |
| `auth.routes.test.ts` | Integration | Flujo completo: register → login → /me → refresh → logout, incluyendo casos de error (409, 401, 400) |

**Cobertura de código:**

| Métrica | Umbral exigido | Resultado |
|---|---|---|
| Statements | 80% | 93.36% |
| Branches | 70% | 84.48% |
| Functions | 80% | 96.96% |
| Lines | 80% | 94.22% |

Los integration tests corren contra una base de datos MongoDB separada (`arcade_test`, mismo contenedor Docker que desarrollo) que se limpia entre tests con `afterEach`/`afterAll`, y usan cookies httpOnly capturadas del login real para simular sesiones de usuario `admin` y `user`.

### Cómo correr los tests

```bash
pnpm test              # correr toda la suite
pnpm test:watch        # modo watch
pnpm test:coverage     # reporte de cobertura
```

### Endpoints (`/api/v1/auth`)
| Método | Ruta | Auth requerida | Rate limit | Descripción |
|---|---|---|---|---|
| POST | `/register` | No | 5/15min | Registra un usuario nuevo (hashea la contraseña) |
| POST | `/login` | No | 5/15min | Verifica credenciales y entrega cookies `accessToken` + `refreshToken` |
| POST | `/refresh` | No (requiere cookie refreshToken) | — | Rota ambos tokens |
| GET | `/me` | Sí | — | Devuelve el usuario autenticado |
| POST | `/logout` | Sí | — | Invalida el refresh token y limpia las cookies |

### Categorías (`/api/v1/machine-categories`)
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/` | 🔒 Autenticado (cualquier rol) |
| GET | `/:id` | 🔒 Autenticado (cualquier rol) |
| POST | `/` | 🔐 Solo `admin` |
| PUT | `/:id` | 🔐 Solo `admin` |
| DELETE | `/:id` | 🔐 Solo `admin` |

### Máquinas (`/api/v1/machines`)
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/?page=1&limit=10` | 🔒 Autenticado (cualquier rol) — con paginación y populate de categoría |
| GET | `/:id` | 🔒 Autenticado (cualquier rol) — con populate de categoría |
| POST | `/` | 🔐 Solo `admin` |
| PUT | `/:id` | 🔐 Solo `admin` |
| DELETE | `/:id` | 🔐 Solo `admin` |

## Manejo de errores

| Situación | Código |
|---|---|
| No autenticado (sin cookie o token inválido/expirado) | 401 |
| Autenticado pero sin el rol requerido | 403 |
| Credenciales inválidas en login | 401 |
| Rate limit excedido en `/auth` o global | 429 |
| Email ya registrado | 409 |
| Payload con tipo de dato inválido (ej. intento de NoSQL injection) | 400 |
| ID con formato inválido (CastError) | 400 |
| Categoría referenciada no existe | 400 |
| Recurso no encontrado | 404 |
| Nombre de categoría duplicado (índice unique, error 11000) | 409 |
| Error interno inesperado | 500 (sin stack trace expuesto) |

## Variables de entorno

```bash
MONGODB_URI=mongodb://usuario:password@localhost:27017/arcade_dev?authSource=admin
PORT=3000
NODE_ENV=development
JWT_ACCESS_SECRET=tu-secreto-para-access-token
JWT_REFRESH_SECRET=tu-secreto-para-refresh-token
```

Para correr los tests de integración se usa además un `.env.test` con las mismas variables, apuntando a una base de datos separada (`arcade_test`).

## Cómo correr el proyecto

```bash
docker compose up -d
pnpm install
pnpm seed
pnpm dev
```

## Stack

Express 5, TypeScript, Mongoose, Zod, JWT (jsonwebtoken), bcrypt, cookie-parser, Helmet, CORS, express-rate-limit, MongoDB 7 (Docker), Jest, ts-jest, Supertest.