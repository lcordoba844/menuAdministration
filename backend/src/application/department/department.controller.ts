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
  CreateDepartmentRequest,
  DepartmentResponse,
  UpdateDepartmentRequest,
} from '@/application/department/department.dto';
import { DepartmentService } from '@/application/department/department.service';
import { Authenticated } from '@/middlewares/authenticated.decorator';

@JsonController('/departments')
@Authenticated()
@Service()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @OpenAPI({ summary: 'Get all departments' })
  @ResponseSchema(DepartmentResponse, { isArray: true })
  public async getDepartments(): Promise<DepartmentResponse[]> {
    return await this.departmentService.getAllDepartments();
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get a department' })
  @ResponseSchema(DepartmentResponse)
  public async getDepartment(
    @Param('id') id: string,
  ): Promise<DepartmentResponse> {
    return await this.departmentService.getDepartment(id);
  }

  @Post()
  @HttpCode(201)
  @OpenAPI({ summary: 'Create a new department' })
  @ResponseSchema(DepartmentResponse)
  public async createDepartment(
    @Body() request: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    return await this.departmentService.createDepartment(request);
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update a department' })
  @ResponseSchema(DepartmentResponse)
  public async updateDepartment(
    @Param('id') id: string,
    @Body() request: UpdateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    return await this.departmentService.updateDepartment(id, request);
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({ summary: 'Delete a department' })
  public async deleteDepartment(@Param('id') id: string): Promise<void> {
    await this.departmentService.deleteDepartment(id);
  }
}
