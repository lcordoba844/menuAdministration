import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import cors from 'cors';
import express from 'express';
import { OpenAPIObject } from 'openapi3-ts';
import 'reflect-metadata';
import {
  getMetadataArgsStorage,
  RoutingControllersOptions,
  useContainer,
  useExpressServer,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swagger from 'swagger-ui-express';
import { Container } from 'typedi';

import { environment, isDevelopment } from '@/config/environment';
import { sequelize } from '@/config/sequelize';
import { LoggerService } from '@/shared/logger.service';
import { requestLogger } from '@/shared/request-logger.middleware';

const logger = Container.get(LoggerService);

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializePreControllerMiddleware();
    this.initializeControllers();
    this.initializePostControllerMiddleware();
  }

  private initializeControllers(): void {
    useContainer(Container);
    useExpressServer(this.app, this.buildRoutingControllerConfig());
  }

  private buildRoutingControllerConfig(): RoutingControllersOptions {
    return {
      controllers: [this.getControllersDirectoryPattern()],
      routePrefix: '/api',
      validation: {
        whitelist: true,
        forbidNonWhitelisted: true,
      },
      classTransformer: true,
    };
  }

  private initializePreControllerMiddleware(): void {
    this.app.use(cors({ origin: 'http://localhost' }));
    this.app.use(requestLogger());
  }

  private initializePostControllerMiddleware(): void {
    if (isDevelopment()) {
      const specs = this.buildOpenApiSpecs();
      this.app.use('/docs', swagger.serve, swagger.setup(specs));
    }
  }

  private buildOpenApiSpecs(): OpenAPIObject {
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
    });

    const storage = getMetadataArgsStorage();
    return routingControllersToSpec(
      storage,
      this.buildRoutingControllerConfig(),
      {
        components: {
          schemas,
        },
        info: {
          title: 'Trading Platform',
          version: '1.0.0',
        },
      }
    );
  }

  private getControllersDirectoryPattern(): string {
    return `${__dirname}/application/**/*.controller.ts`;
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await sequelize.authenticate();
      logger.info('Database connection established successfully');
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Unable to connect to the database: ${error}`);
      }
      process.exit(1);
    }
  }

  public async listen(): Promise<void> {
    await this.initializeDatabase();

    this.app.listen(environment.port, () => {
      logger.info(`Server running on port ${environment.port}`);
    });
  }
}
