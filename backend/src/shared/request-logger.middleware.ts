import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

import { isDevelopment } from '@/config/environment';
import { LoggerService } from '@/shared/logger.service';

export function requestLogger() {
  const logger = Container.get(LoggerService);
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!isDevelopment()) return next();

    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.debug(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    });

    next();
  };
}
