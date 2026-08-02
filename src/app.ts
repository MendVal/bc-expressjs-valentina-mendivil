import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import { machinesRouter } from './routes/machines.routes';

export function createApp(): Application {
  const app = express();

  // express.json() — parseo de body (requerido para POST/PUT)
  app.use(express.json());

  //  Logger personalizado — registra método, URL, status y duración
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
  });

  //  Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  //  Rutas del recurso principal (dominio: Sala de videojuegos / Arcade)
  app.use('/api/v1/machines', machinesRouter);

  // Handler para rutas no encontradas (404)
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
  });

  //  Error handler global — SIEMPRE el último app.use(), 4 parámetros
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}