import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import {
  CreateOfficeRequest,
  OfficeResponse,
  UpdateOfficeRequest,
} from '@/application/office/office.dto';
import { OfficeService } from '@/application/office/office.service';
import { requireAuth } from '@/middlewares/auth.middleware';

@JsonController('/offices')
@UseBefore(requireAuth)
@Service()
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get()
  @OpenAPI({ summary: 'Get all offices' })
  @ResponseSchema(OfficeResponse, { isArray: true })
  public async getOffices(): Promise<OfficeResponse[]> {
    return await this.officeService.getAllOffices();
  }

  @Post()
  @HttpCode(201)
  @OpenAPI({ summary: 'Create a new office' })
  @ResponseSchema(OfficeResponse)
  public async createOffice(
    @Body() request: CreateOfficeRequest,
  ): Promise<OfficeResponse> {
    return await this.officeService.createOffice(request);
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update an office' })
  @ResponseSchema(OfficeResponse)
  public async updateOffice(
    @Param('id') id: string,
    @Body() request: UpdateOfficeRequest,
  ): Promise<OfficeResponse> {
    return await this.officeService.updateOffice(id, request);
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({ summary: 'Delete an office' })
  public async deleteOffice(@Param('id') id: string): Promise<void> {
    await this.officeService.deleteOffice(id);
  }
}
