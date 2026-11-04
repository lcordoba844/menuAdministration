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
      where: { enabled: true },
      order: [['createdAt', 'DESC']],
    });

    return offices.map((office) => this.toResponse(office));
  }

  public async createOffice(
    request: CreateOfficeRequest,
  ): Promise<OfficeResponse> {
    const office = await Office.create({
      name: request.name,
      city: request.city,
      country: request.country,
      address: request.address,
      enabled: true,
    });

    return this.toResponse(office);
  }

  public async updateOffice(
    id: string,
    request: UpdateOfficeRequest,
  ): Promise<OfficeResponse> {
    const office = await this.findOffice(id);
    const updatedOffice = await office.update({
      name: request.name,
      city: request.city,
      country: request.country,
      address: request.address,
    });

    return this.toResponse(updatedOffice);
  }

  public async deleteOffice(id: string): Promise<void> {
    const office = await this.findOffice(id);

    await office.update({ enabled: false });
  }

  private async findOffice(id: string): Promise<Office> {
    const office = await Office.findOne({
      where: { id, enabled: true },
    });
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
      address: office.address,
      enabled: office.enabled,
      createdAt: office.createdAt,
      updatedAt: office.updatedAt,
    };
  }
}
