import type { AxiosInstance } from 'axios';

import { toApiError } from '@/api/api-error';
import type {
  Office,
  SaveOfficeRequest,
} from '@/features/offices/office.types';

const errorMessages = {
  400: 'Check the office details and try again.',
  404: 'This office is no longer available. Refresh the list and try again.',
};

export class OfficeApi {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  public async getAll(): Promise<Office[]> {
    try {
      const { data } = await this.api.get<Office[]>('/offices');
      return data;
    } catch (error) {
      throw toApiError(error, errorMessages);
    }
  }

  public async create(input: SaveOfficeRequest): Promise<Office> {
    try {
      const { data } = await this.api.post<Office>('/offices', input);
      return data;
    } catch (error) {
      throw toApiError(error, errorMessages);
    }
  }

  public async update(id: string, input: SaveOfficeRequest): Promise<Office> {
    try {
      const { data } = await this.api.put<Office>(`/offices/${id}`, input);
      return data;
    } catch (error) {
      throw toApiError(error, errorMessages);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/offices/${id}`);
    } catch (error) {
      throw toApiError(error, errorMessages);
    }
  }
}
