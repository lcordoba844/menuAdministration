import { BadRequestError, HttpError, NotFoundError } from 'routing-controllers';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Service } from 'typedi';

import {
  CreateDinerRequest,
  DinerResponse,
  UpdateDinerRequest,
} from '@/application/diner/diner.dto';
import { sequelize } from '@/config/sequelize';
import Department from '@/models/department.model';
import Diner from '@/models/diner.model';
import Office from '@/models/office.model';

@Service()
export class DinerService {
  public async getDiner(userId: string): Promise<DinerResponse> {
    const diner = await Diner.findOne({
      where: { userId },
      include: [
        {
          association: 'dietaryRestrictions',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });
    if (!diner) {
      throw new NotFoundError('Diner not found');
    }

    return this.toResponse(
      diner,
      diner.dietaryRestrictions.map((restriction) => restriction.id),
    );
  }

  public async createDiner(
    userId: string,
    request: CreateDinerRequest,
  ): Promise<DinerResponse> {
    try {
      await this.validateOffice(request.officeId);
      await this.validateDepartment(request.departmentId);

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

        return this.toResponse(diner, dietaryRestrictionIds);
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

  public async updateDiner(
    userId: string,
    request: UpdateDinerRequest,
  ): Promise<DinerResponse> {
    try {
      const diner = await Diner.findOne({
        where: { userId },
      });
      if (!diner) {
        throw new NotFoundError('Diner not found');
      }

      if (request.officeId !== undefined) {
        await this.validateOffice(request.officeId);
      }
      if (request.departmentId !== undefined) {
        await this.validateDepartment(request.departmentId);
      }

      return await sequelize.transaction(async (transaction) => {
        const updatedDiner = await diner.update(
          {
            name: request.name,
            officeId: request.officeId,
            departmentId: request.departmentId,
          },
          { transaction },
        );
        if (request.dietaryRestrictionIds !== undefined) {
          await updatedDiner.$set(
            'dietaryRestrictions',
            [...new Set(request.dietaryRestrictionIds)],
            { transaction },
          );
        }
        const dietaryRestrictions = await updatedDiner.$get(
          'dietaryRestrictions',
          { transaction },
        );

        return this.toResponse(
          updatedDiner,
          dietaryRestrictions.map((restriction) => restriction.id),
        );
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new BadRequestError(
          'User, office, department, or dietary restriction does not exist',
        );
      }
      throw error;
    }
  }

  private async validateOffice(officeId: string): Promise<void> {
    const office = await Office.findOne({
      where: { id: officeId, enabled: true },
    });
    if (!office) {
      throw new BadRequestError('Office does not exist or has been deleted');
    }
  }

  private async validateDepartment(departmentId: string): Promise<void> {
    const department = await Department.findOne({
      where: { id: departmentId, enabled: true },
    });
    if (!department) {
      throw new BadRequestError(
        'Department does not exist or has been deleted',
      );
    }
  }

  private toResponse(
    diner: Diner,
    dietaryRestrictionIds: string[],
  ): DinerResponse {
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
  }
}
