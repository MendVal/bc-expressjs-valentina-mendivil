# 🎮 API REST en 4 Capas — Máquinas de Arcade (Semana 03)

**Aprendiz:** Valentina Mendivil Correa

**Ficha:** 3228973A

**Dominio:** Sala de videojuegos / Arcade

**Recurso implementado:** Machine

## ¿Qué hace este proyecto?

API REST con arquitectura en 4 capas (`routes → controllers → services →
repositories`) sobre el inventario de máquinas arcade, con paginación y
contratos de respuesta consistentes.

## Arquitectura

- **`repositories/`** — única capa que toca el "store" en memoria. Todos
  los métodos son `async` y devuelven copias defensivas (nunca la
  referencia interna del array), para que nadie pueda mutar los datos por
  fuera de esta capa.
- **`services/`** — lógica de negocio, sin ningún import de Express. Aquí
  vive la paginación (`page`/`limit`).
- **`controllers/`** — "thin controllers": cada función tiene exactamente
  3 pasos (extraer datos → llamar al service → responder). No hay
  cálculos ni validaciones de dominio aquí.
- **`routes/`** — solo mapea `URL + método HTTP` a la función del
  controller correspondiente.

## Endpoints y contratos

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/machines?page=1&limit=10` | Listar con paginación | 200 |
| GET | `/api/v1/machines/:id` | Obtener por ID | 200 / 404 |
| POST | `/api/v1/machines` | Crear | 201 |
| PUT | `/api/v1/machines/:id` | Actualizar | 200 / 404 |
| DELETE | `/api/v1/machines/:id` | Eliminar | 204 / 404 |

```json
// GET /machines?page=1&limit=2 → 200
{ "data": [...], "total": 4, "page": 1, "limit": 2 }

// GET /machines/1 → 200
{ "data": { "id": 1, "name": "Street Fighter II", ... } }

// GET /machines/999 → 404
{ "error": "Not Found", "message": "Machine 999 not found" }
```

## Cómo correrlo

```bash
pnpm install
pnpm dev     
pnpm build  
```

## Cómo probarlo con curl

```bash
curl "http://localhost:3000/api/v1/machines?page=1&limit=2"

curl -X POST http://localhost:3000/api/v1/machines \
  -H "Content-Type: application/json" \
  -d '{"name":"Tekken 7","category":"lucha","price":3.5,"stock":1,"active":true}'

curl http://localhost:3000/api/v1/machines/1

curl -X PUT http://localhost:3000/api/v1/machines/1 \
  -H "Content-Type: application/json" \
  -d '{"price":3}'

curl -X DELETE http://localhost:3000/api/v1/machines/1
```

## Evidencia de pruebas

Capturas en la carpeta `capturas/`:
- `01-get-all-paginado.png` — GET /api/v1/machines?page=1&limit=2 (200, con paginación)
- `02-get-by-id.png` — GET /api/v1/machines/:id (200)
- `03-post.png` — POST /api/v1/machines (201)
- `04-put.png` — PUT /api/v1/machines/:id (200)
- `05-delete.png` — DELETE /api/v1/machines/:id (204)
- `06-build-sin-errores.png` — `pnpm build` compilando sin errores TypeScript