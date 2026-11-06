import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import {
  CreateDietaryRestrictionRequest,
  DietaryRestrictionResponse,
  UpdateDietaryRestrictionRequest,
} from '@/application/dietary-restriction/dietary-restriction.dto';
import { DietaryRestrictionService } from '@/application/dietary-restriction/dietary-restriction.service';
import { Authenticated } from '@/middlewares/authenticated.decorator';

@JsonController('/dietary-restrictions')
@Authenticated()
@Service()
export class DietaryRestrictionController {
  constructor(
    private readonly dietaryRestrictionService: DietaryRestrictionService,
  ) {}

  @Get()
  @OpenAPI({ summary: 'Get all dietary restrictions' })
  @ResponseSchema(DietaryRestrictionResponse, { isArray: true })
  public async getDietaryRestrictions(): Promise<DietaryRestrictionResponse[]> {
    return await this.dietaryRestrictionService.getAllDietaryRestrictions();
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get a dietary restriction' })
  @ResponseSchema(DietaryRestrictionResponse)
  public async getDietaryRestriction(
    @Param('id') id: string,
  ): Promise<DietaryRestrictionResponse> {
    return await this.dietaryRestrictionService.getDietaryRestriction(id);
  }

  @Post()
  @HttpCode(201)
  @OpenAPI({ summary: 'Create a new dietary restriction' })
  @ResponseSchema(DietaryRestrictionResponse)
  public async createDietaryRestriction(
    @Body() request: CreateDietaryRestrictionRequest,
  ): Promise<DietaryRestrictionResponse> {
    return await this.dietaryRestrictionService.createDietaryRestriction(
      request,
    );
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update a dietary restriction' })
  @ResponseSchema(DietaryRestrictionResponse)
  public async updateDietaryRestriction(
    @Param('id') id: string,
    @Body() request: UpdateDietaryRestrictionRequest,
  ): Promise<DietaryRestrictionResponse> {
    return await this.dietaryRestrictionService.updateDietaryRestriction(
      id,
      request,
    );
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({ summary: 'Delete a dietary restriction' })
  public async deleteDietaryRestriction(
    @Param('id') id: string,
  ): Promise<void> {
    await this.dietaryRestrictionService.deleteDietaryRestriction(id);
  }
}
