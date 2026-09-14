import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../errors/AppError';

// Siempre debe ir DESPUÉS de authMiddleware (requiere req.user ya poblado)
export function requireRole(...roles: string[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'Autenticación requerida'));
    }

    if (!roles.includes(req.user.role as string)) {
      return next(
        new AppError(403, `Acceso denegado. Roles permitidos: ${roles.join(', ')}`)
      );
    }

    next();
  };
}