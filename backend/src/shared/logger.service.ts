import { Service } from 'typedi';
import winston from 'winston';

import { isDevelopment } from '@/config/environment';

@Service()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [new winston.transports.Console()];
    if (isDevelopment()) {
      transports.push(new winston.transports.File({ filename: 'debug.log' }));
    }
    this.logger = winston.createLogger({
      level: isDevelopment() ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${String(timestamp)}] ${level.toUpperCase()}: ${JSON.stringify(message)}`;
        })
      ),
      transports,
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}
