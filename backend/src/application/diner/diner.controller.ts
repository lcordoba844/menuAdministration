import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Post,
  Put,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import {
  CreateDinerRequest,
  DinerResponse,
  UpdateDinerRequest,
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

  @Get('/me')
  @OpenAPI({ summary: 'Get the diner profile for the authenticated user' })
  @ResponseSchema(DinerResponse)
  public async getDiner(
    @Req() request: AuthenticatedRequest,
  ): Promise<DinerResponse> {
    return await this.dinerService.getDiner(request.auth.userId);
  }

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

  @Put('/me')
  @OpenAPI({ summary: 'Update the diner profile for the authenticated user' })
  @ResponseSchema(DinerResponse)
  public async updateDiner(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateDinerRequest,
  ): Promise<DinerResponse> {
    return await this.dinerService.updateDiner(request.auth.userId, body);
  }

  @Delete('/me')
  @HttpCode(204)
  @OpenAPI({ summary: 'Delete the diner profile for the authenticated user' })
  public async deleteDiner(
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.dinerService.deleteDiner(request.auth.userId);
  }
}
