# 🎮 API REST — Máquinas de Arcade (Semana 02)

**Aprendiz:** Valentina Mendivil Correa

**Ficha:** 3228973A

**Dominio:** Sala de videojuegos / Arcade

**Recurso implementado:** Machine

## ¿Qué hace este proyecto?

API REST construida con Express 5 + TypeScript que expone operaciones CRUD
sobre el inventario de máquinas de una sala de videojuegos. Usa un array en
memoria como almacenamiento temporal (sin base de datos todavía, eso llega
en semanas posteriores).

## Por qué elegí `Machine` otra vez

Reutilicé el mismo recurso de la semana 01 porque sigue siendo el núcleo de
mi dominio, y esta semana el objetivo es aprender a exponerlo vía HTTP con
Express, no cambiar de recurso. Las demás entidades (`tokens`, `players`,
`maintenance`) las iré incorporando cuando el tema de la semana lo pida
(por ejemplo, relaciones entre recursos cuando lleguemos a base de datos).

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/machines` | Listar todas las máquinas | 200 |
| GET | `/api/v1/machines/:id` | Obtener una máquina por ID | 200 / 404 |
| POST | `/api/v1/machines` | Crear una máquina nueva | 201 / 400 |
| PUT | `/api/v1/machines/:id` | Actualizar una máquina | 200 / 404 / 400 |
| DELETE | `/api/v1/machines/:id` | Eliminar una máquina | 204 / 404 |

## Validación

Al crear o actualizar, se verifica que estén presentes los 5 campos:
`name`, `category`, `price`, `stock`, `active`. Si falta alguno, responde
`400` con la lista de campos faltantes.

## Cómo correrlo

```bash
pnpm install
pnpm dev   
pnpm build   
```

## Cómo probarlo con curl

```bash
curl http://localhost:3000/api/v1/machines

curl -X POST http://localhost:3000/api/v1/machines \
  -H "Content-Type: application/json" \
  -d '{"name":"Tekken 7","category":"lucha","price":3.5,"stock":1,"active":true}'

curl http://localhost:3000/api/v1/machines/1

curl -X PUT http://localhost:3000/api/v1/machines/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Tekken 7 Turbo","category":"lucha","price":4,"stock":2,"active":true}'

curl -X DELETE http://localhost:3000/api/v1/machines/1
```

## Evidencia de pruebas (Thunder Client)
También probado con Thunder Client (capturas de las 5 operaciones incluidas
en la entrega).

Capturas de las 5 operaciones CRUD en la carpeta `capturas/`:
- `01-get-all.png` — GET /api/v1/machines (200)
- `02-get-by-id.png` — GET /api/v1/machines/:id (200)
- `03-post.png` — POST /api/v1/machines (201)
- `04-put.png` — PUT /api/v1/machines/:id (200)
- `05-delete.png` — DELETE /api/v1/machines/:id (204)


## Middlewares (en orden)

1. `express.json()` — parseo del body
2. Logger personalizado — imprime método, ruta, status y duración
3. Rutas de `machines`
4. Handler 404 para rutas no encontradas
5. Error handler global (4 parámetros, siempre al final)