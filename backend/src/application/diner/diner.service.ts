import { BadRequestError, HttpError } from 'routing-controllers';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Service } from 'typedi';

import {
  CreateDinerRequest,
  DinerResponse,
} from '@/application/diner/diner.dto';
import { sequelize } from '@/config/sequelize';
import Diner from '@/models/diner.model';

@Service()
export class DinerService {
  public async createDiner(
    userId: string,
    request: CreateDinerRequest,
  ): Promise<DinerResponse> {
    try {
      return await sequelize.transaction(async (transaction) => {
        const diner = await Diner.create(
          {
            userId,
            name: request.name,
            officeId: request.officeId,
            departmentId: request.departmentId,
          },
          { transaction },
        );
        const dietaryRestrictionIds = [
          ...new Set(request.dietaryRestrictionIds ?? []),
        ];
        await diner.$set('dietaryRestrictions', dietaryRestrictionIds, {
          transaction,
        });

        return {
          id: diner.id,
          name: diner.name,
          userId: diner.userId,
          officeId: diner.officeId,
          departmentId: diner.departmentId,
          dietaryRestrictionIds,
          createdAt: diner.createdAt,
          updatedAt: diner.updatedAt,
        };
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new HttpError(409, 'This user already has a diner profile');
      }
      if (error instanceof ForeignKeyConstraintError) {
        throw new BadRequestError(
          'User, office, department, or dietary restriction does not exist',
        );
      }
      throw error;
    }
  }
}
