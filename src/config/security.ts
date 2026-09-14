import rateLimit from 'express-rate-limit';
import cors, { CorsOptions } from 'cors';

// Límite global — toda la API: 100 req / 15 min
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta de nuevo más tarde' },
});

// Límite de auth — login/register: 5 req / 15 min (anti fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de inicio de sesión, intenta más tarde' },
});

// Whitelist de CORS — agrega aquí el origen de tu frontend si lo tienes
const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:3001'];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado: origen ${origin} no permitido`));
    }
  },
  credentials: true, // necesario porque usas cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};