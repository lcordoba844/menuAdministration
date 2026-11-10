import type { AxiosInstance } from 'axios';

import { toApiError } from '@/api/api-error';
import type {
  Department,
  SaveDepartmentRequest,
} from '@/features/departments/department.types';

const errorMessages = {
  400: 'Check the department details and try again.',
  404: 'This department is no longer available. Refresh the list and try again.',
};

export class DepartmentApi {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  public async getAll(): Promise<Department[]> {
    try {
      const { data } = await this.api.get<Department[]>('/departments');
      return data;
    } catch (error) {
      throw toApiError(error, errorMessages);
    }
  }

  public async create(input: SaveDepartmentRequest): Promise<Department> {
    try {
      const { data } = await this.api.post<Department>('/departments', input);
      return data;
    } catch (error) {
      throw toApiError(error, errorMessages);
    }
  }

  public async update(
    id: string,
    input: SaveDepartmentRequest,
  ): Promise<Department> {
    try {
      const { data } = await this.api.put<Department>(
        `/departments/${id}`,
        input,
      );
      return data;
    } catch (error) {
      throw toApiError(error, errorMessages);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/departments/${id}`);
    } catch (error) {
      throw toApiError(error, errorMessages);
    }
  }
}
