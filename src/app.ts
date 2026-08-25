import express from 'express';
import { morganMiddleware } from './config/logger';
import { machinesRouter } from './routes/machines.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 1. Middlewares generales
app.use(express.json());
app.use(morganMiddleware);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '05', project: 'postgresql-prisma' });
});

// 2. Rutas del dominio
app.use('/api/v1/machines', machinesRouter);

// 3. notFound DESPUÉS de todas las rutas
app.use(notFound);

// 4. errorHandler como ÚLTIMO middleware (4 parámetros)
app.use(errorHandler);

export default app;