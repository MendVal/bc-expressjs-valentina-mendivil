
import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';

const isDev = process.env['NODE_ENV'] !== 'production';

export const logger = createLogger({
  level: isDev ? 'http' : 'warn',
  format: isDev
    ? format.combine(
        format.colorize(),
        format.timestamp({ format: 'HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
      )
    : format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    ...(isDev
      ? []
      : [new transports.File({ filename: 'logs/error.log', level: 'error' })]),
  ],
});

// Stream que redirige las líneas de Morgan hacia logger.http()
export const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};

const morganFormat = isDev ? 'dev' : 'combined';
export const morganMiddleware = morgan(morganFormat, { stream: morganStream });