import express from 'express';
import machineCategoryRouter from './routes/machineCategory.routes';
import machineRouter from './routes/machine.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/machine-categories', machineCategoryRouter);
app.use('/api/v1/machines', machineRouter);

app.use(notFound);
app.use(errorHandler);