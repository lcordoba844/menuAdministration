import { NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';

import {
  CreateDepartmentRequest,
  DepartmentResponse,
  UpdateDepartmentRequest,
} from '@/application/department/department.dto';
import Department from '@/models/department.model';

@Service()
export class DepartmentService {
  public async getAllDepartments(): Promise<DepartmentResponse[]> {
    const departments = await Department.findAll({
      where: { enabled: true },
      order: [['createdAt', 'DESC']],
    });

    return departments.map((department) => this.toResponse(department));
  }

  public async getDepartment(id: string): Promise<DepartmentResponse> {
    const department = await this.findDepartment(id);

    return this.toResponse(department);
  }

  public async createDepartment(
    request: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const department = await Department.create({
      name: request.name,
      description: request.description,
      enabled: true,
    });

    return this.toResponse(department);
  }

  public async updateDepartment(
    id: string,
    request: UpdateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const department = await this.findDepartment(id);
    const updatedDepartment = await department.update({
      name: request.name,
      description: request.description,
    });

    return this.toResponse(updatedDepartment);
  }

  public async deleteDepartment(id: string): Promise<void> {
    const department = await this.findDepartment(id);

    await department.update({ enabled: false });
  }

  private async findDepartment(id: string): Promise<Department> {
    const department = await Department.findOne({
      where: { id, enabled: true },
    });
    if (!department) {
      throw new NotFoundError('Department not found');
    }

    return department;
  }

  private toResponse(department: Department): DepartmentResponse {
    return {
      id: department.id,
      name: department.name,
      description: department.description ?? null,
      enabled: department.enabled,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }
}
