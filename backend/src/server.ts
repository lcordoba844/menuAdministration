import Container from 'typedi';

import { App } from '@/app';
import { LoggerService } from '@/shared/logger.service';

const app = new App();
const logger = Container.get(LoggerService);

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error}`);
  setTimeout(() => process.exit(1), 100);
});
process.on('unhandledRejection', (reason: unknown) => {
  const reasonMsg =
    typeof reason === 'string' ? reason : JSON.stringify(reason);
  logger.error(`Unhandled Rejection: ${reasonMsg}`);
  setTimeout(() => process.exit(1), 100);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  setTimeout(() => process.exit(0), 100);
});
process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  setTimeout(() => process.exit(0), 100);
});

app.listen().catch(error => {
  logger.error(`Failed to start server: ${error}`);
  process.exit(1);
});
