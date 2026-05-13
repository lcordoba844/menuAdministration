import { Get, JsonController } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import { HealthResponse } from '@/application/health/health.dto';

@JsonController('/health')
@Service()
export class HealthController {
  @Get()
  @OpenAPI({ summary: 'Get health status of the web service' })
  @ResponseSchema(HealthResponse)
  public getHealth(): HealthResponse {
    return {
      timestamp: new Date().toISOString(),
      message: 'Service is healthy',
    };
  }
}
