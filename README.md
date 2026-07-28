# 🎮 Procesador de Inventario — Sala de Videojuegos / Arcade

Proyecto semanal 01 del bootcamp `bc-expressjs`.

**Aprendiz:** Valentina Mendivil Correa
**Ficha:** 3228973A
**Dominio asignado:** Sala de videojuegos / Arcade
**Entidades del dominio completo:** `machines`, `tokens`, `players`, `maintenance`

## ¿Qué hace este proyecto?

Es una herramienta de línea de comandos que simula el sistema de inventario
de una sala de videojuegos (arcade). Lee el catálogo de máquinas desde un
archivo JSON, calcula estadísticas del inventario (precio promedio, máquina
más cara/barata, cuántas están operativas vs. en mantenimiento) y genera un
reporte. También permite filtrar el catálogo por categoría de juego desde la
terminal.

Esta semana el foco es practicar Node.js con TypeScript: módulos ESM,
`async`/`await` para las operaciones de lectura/escritura de archivos, y
manejo de errores con `try`/`catch`.

## Por qué elegí `Machine` como recurso

De las 4 entidades de mi dominio (`machines`, `tokens`, `players`,
`maintenance`), usé `machines` porque encaja naturalmente con la estructura
que pedía el material base de la semana (id, nombre, categoría, precio,
stock, estado activo/inactivo). Las demás entidades del dominio las iré
incorporando en semanas siguientes, según el tema que toque (por ejemplo,
`players` y `tokens` probablemente aparezcan cuando lleguemos a
persistencia con base de datos).

### El recurso `Machine`

| Campo      | Tipo    | Qué representa |
|------------|---------|-----------------|
| `id`       | string  | Identificador único de la máquina |
| `name`     | string  | Nombre del juego (ej. "Pac-Man", "Tekken 7") |
| `category` | string  | Tipo de juego: `lucha`, `carreras`, `disparos`, `clasicos`, `baile`, `cabina` |
| `price`    | number  | Costo en fichas/tokens por partida |
| `stock`    | number  | Cuántas unidades de esa máquina hay en el local |
| `active`   | boolean | `true` si está operativa, `false` si está en mantenimiento |

## Estructura del proyecto

```
├── data/
│   └── machines.json     → catálogo de 12 máquinas de ejemplo
├── src/
│   ├── types.ts          → interfaces Machine, MachineSummary, Report
│   ├── reader.ts         → lee y parsea data/machines.json
│   ├── processor.ts      → filtra por categoría y calcula el resumen
│   ├── writer.ts         → escribe output/report.json
│   └── index.ts          → punto de entrada: orquesta todo el flujo
├── package.json
└── tsconfig.json
```

## Ejemplo de salida en consola

```
Reporte de la Sala de Videojuegos (Arcade)
-----------------------------------------

Filtro aplicado: lucha
Total de máquinas: 3
Operativas: 3 | En mantenimiento: 0
Precio promedio por partida: $3
Más cara: Tekken 7 ($3.5)
Más barata: Street Fighter II ($2.5)
Categorías: lucha

Reporte guardado en: .../output/report.json
```

El reporte completo (con el detalle de cada máquina filtrada) queda guardado
en `output/report.json` — esa carpeta no se sube al repo porque se genera
cada vez que corres el proyecto.

## Manejo de errores

- Si `data/machines.json` no existe o no se puede leer, se lanza un error
  descriptivo indicando la ruta que se intentó leer.
- Si filtras por una categoría que no existe en el catálogo (ej.
  `--category futbolito`), el programa te dice qué categorías sí están
  disponibles en lugar de simplemente fallar sin explicación.

  ## Cómo correrlo

```bash
pnpm install  # instala dependencias
pnpm dev   # corre el proyecto sin filtro
pnpm dev -- --category lucha # corre filtrando solo la categoría "lucha"
pnpm build  # verifica que compile sin errores de TypeScript
```

Categorías disponibles en el catálogo de ejemplo: `lucha`, `carreras`,
`disparos`, `clasicos`, `baile`, `cabina`.

