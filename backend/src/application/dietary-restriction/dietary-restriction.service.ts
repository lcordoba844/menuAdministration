import { NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';

import {
  CreateDietaryRestrictionRequest,
  DietaryRestrictionResponse,
  UpdateDietaryRestrictionRequest,
} from '@/application/dietary-restriction/dietary-restriction.dto';
import DietaryRestriction from '@/models/dietary_restriction.model';

@Service()
export class DietaryRestrictionService {
  public async getAllDietaryRestrictions(): Promise<
    DietaryRestrictionResponse[]
  > {
    const restrictions = await DietaryRestriction.findAll({
      where: { enabled: true },
      order: [['createdAt', 'DESC']],
    });

    return restrictions.map((restriction) => this.toResponse(restriction));
  }

  public async getDietaryRestriction(
    id: string,
  ): Promise<DietaryRestrictionResponse> {
    const restriction = await this.findDietaryRestriction(id);

    return this.toResponse(restriction);
  }

  public async createDietaryRestriction(
    request: CreateDietaryRestrictionRequest,
  ): Promise<DietaryRestrictionResponse> {
    const restriction = await DietaryRestriction.create({
      name: request.name,
      description: request.description,
      enabled: true,
    });

    return this.toResponse(restriction);
  }

  public async updateDietaryRestriction(
    id: string,
    request: UpdateDietaryRestrictionRequest,
  ): Promise<DietaryRestrictionResponse> {
    const restriction = await this.findDietaryRestriction(id);
    const updatedRestriction = await restriction.update({
      name: request.name,
      description: request.description,
    });

    return this.toResponse(updatedRestriction);
  }

  public async deleteDietaryRestriction(id: string): Promise<void> {
    const restriction = await this.findDietaryRestriction(id);

    await restriction.update({ enabled: false });
  }

  private async findDietaryRestriction(
    id: string,
  ): Promise<DietaryRestriction> {
    const restriction = await DietaryRestriction.findOne({
      where: { id, enabled: true },
    });
    if (!restriction) {
      throw new NotFoundError('Dietary restriction not found');
    }

    return restriction;
  }

  private toResponse(
    restriction: DietaryRestriction,
  ): DietaryRestrictionResponse {
    return {
      id: restriction.id,
      name: restriction.name,
      description: restriction.description ?? null,
      enabled: restriction.enabled,
      createdAt: restriction.createdAt,
      updatedAt: restriction.updatedAt,
    };
  }
}
