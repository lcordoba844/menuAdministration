import { Body, HttpCode, JsonController, Post, Req } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import {
  CreateDinerRequest,
  DinerResponse,
} from '@/application/diner/diner.dto';
import { DinerService } from '@/application/diner/diner.service';
import {
  Authenticated,
  AuthenticatedRequest,
} from '@/middlewares/authenticated.decorator';

@JsonController('/diners')
@Authenticated()
@Service()
export class DinerController {
  constructor(private readonly dinerService: DinerService) {}

  @Post()
  @HttpCode(201)
  @OpenAPI({ summary: 'Create a diner profile for the authenticated user' })
  @ResponseSchema(DinerResponse)
  public async createDiner(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateDinerRequest,
  ): Promise<DinerResponse> {
    return await this.dinerService.createDiner(request.auth.userId, body);
  }
}
