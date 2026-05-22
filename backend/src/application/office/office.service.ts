import { NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';

import {
  CreateOfficeRequest,
  OfficeResponse,
  UpdateOfficeRequest,
} from '@/application/office/office.dto';
import Office from '@/models/office.model';

@Service()
export class OfficeService {
  public async getAllOffices(): Promise<OfficeResponse[]> {
    const offices = await Office.findAll({
      order: [['createdAt', 'DESC']],
    });

    return offices.map((office) => this.toResponse(office));
  }

  public async createOffice(
    request: CreateOfficeRequest,
  ): Promise<OfficeResponse> {
    const office = await Office.create({ ...request });

    return this.toResponse(office);
  }

  public async updateOffice(
    id: string,
    request: UpdateOfficeRequest,
  ): Promise<OfficeResponse> {
    const office = await this.findOffice(id);
    const updatedOffice = await office.update(request);

    return this.toResponse(updatedOffice);
  }

  public async deleteOffice(id: string): Promise<void> {
    const office = await this.findOffice(id);

    await office.destroy();
  }

  private async findOffice(id: string): Promise<Office> {
    const office = await Office.findByPk(id);
    if (!office) {
      throw new NotFoundError('Office not found');
    }

    return office;
  }

  private toResponse(office: Office): OfficeResponse {
    return {
      id: office.id,
      name: office.name,
      city: office.city,
      country: office.country,
      latitude: office.latitude,
      longitude: office.longitude,
      isActive: office.isActive,
      createdAt: office.createdAt,
      updatedAt: office.updatedAt,
    };
  }
}
