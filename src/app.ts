import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import machineCategoryRouter from './routes/machineCategory.routes';
import machineRouter from './routes/machine.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { sanitizeInputs } from './middlewares/sanitize.middleware';
import { globalLimiter, corsOptions } from './config/security';

export const app = express();

// Capas de seguridad — el orden importa
app.use(helmet());
app.use(globalLimiter);
app.use(cors(corsOptions));

// Parsing
app.use(express.json());
app.use(cookieParser());

// Sanitizar DESPUÉS de parsear, ANTES de las rutas
app.use(sanitizeInputs);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/machine-categories', machineCategoryRouter);
app.use('/api/v1/machines', machineRouter);

app.use(notFound);
app.use(errorHandler);