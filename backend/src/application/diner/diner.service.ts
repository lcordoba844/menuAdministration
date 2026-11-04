import { BadRequestError, HttpError } from 'routing-controllers';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Service } from 'typedi';

import {
  CreateDinerRequest,
  DinerResponse,
} from '@/application/diner/diner.dto';
import { sequelize } from '@/config/sequelize';
import Department from '@/models/department.model';
import Diner from '@/models/diner.model';
import Office from '@/models/office.model';

@Service()
export class DinerService {
  public async createDiner(
    userId: string,
    request: CreateDinerRequest,
  ): Promise<DinerResponse> {
    try {
      return await sequelize.transaction(async (transaction) => {
        const office = await Office.findOne({
          where: { id: request.officeId, enabled: true },
          transaction,
          lock: transaction.LOCK.SHARE,
        });
        if (!office) {
          throw new BadRequestError(
            'Office does not exist or has been deleted',
          );
        }

        const department = await Department.findOne({
          where: { id: request.departmentId, enabled: true },
          transaction,
          lock: transaction.LOCK.SHARE,
        });
        if (!department) {
          throw new BadRequestError(
            'Department does not exist or has been deleted',
          );
        }

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
