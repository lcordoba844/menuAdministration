import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from 'routing-controllers';
import { ForeignKeyConstraintError, Op } from 'sequelize';
import { Service } from 'typedi';

import {
  CreateMenuRequest,
  MenuResponse,
  UpdateMenuRequest,
  CreateOrUpdateMenuOptionRequest,
} from '@/application/menu/menu.dto';
import { sequelize } from '@/config/sequelize';
import DietaryRestriction from '@/models/dietary_restriction.model';
import Menu from '@/models/menu.model';
import MenuOption from '@/models/menu_option.model';
import Order from '@/models/order.model';
import User from '@/models/user.model';

@Service()
export class MenuService {
  public async getAllMenus(): Promise<MenuResponse[]> {
    const menus = await Menu.findAll({
      where: { enabled: true },
      include: [
        {
          association: 'options',
          where: { enabled: true },
          required: false,
          include: ['dietaryRestrictions'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return menus.map((menu) => this.toResponse(menu, menu.options));
  }

  public async getMenu(id: string): Promise<MenuResponse> {
    const menu = await this.findMenu(id);

    return this.toResponse(menu, menu.options);
  }

  public async createMenu(
    userId: string,
    request: CreateMenuRequest,
  ): Promise<MenuResponse> {
    const user = await User.findOne({ where: { id: userId, enabled: true } });
    if (!user) {
      throw new BadRequestError('User does not exist or has been deleted');
    }
    await this.validateRestrictions(request.options);

    try {
      return await sequelize.transaction(async (transaction) => {
        const menu = await Menu.create(
          {
            date: request.date,
            deadlineAt: new Date(request.deadlineAt),
            title: request.title,
            description: request.description ?? '',
            enabled: true,
            createdByUserId: userId,
          },
          { transaction },
        );
        for (const option of request.options) {
          const createdOption = await MenuOption.create(
            {
              menuId: menu.id,
              name: option.name,
              description: option.description ?? '',
              enabled: true,
            },
            { transaction },
          );
          await createdOption.$set(
            'dietaryRestrictions',
            [...new Set(option.restrictionsId ?? [])],
            { transaction },
          );
        }
        const options = await menu.$get('options', {
          where: { enabled: true },
          include: ['dietaryRestrictions'],
          transaction,
        });

        return this.toResponse(menu, options);
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new BadRequestError('A menu reference does not exist');
      }
      throw error;
    }
  }

  public async updateMenu(
    id: string,
    userId: string,
    request: UpdateMenuRequest,
  ): Promise<MenuResponse> {
    const menu = await this.findOwnedMenu(id, userId);
    if (request.options !== undefined) {
      this.validateOptions(menu.options, request.options);
      await this.validateRestrictions(request.options);
    }

    return await sequelize.transaction(async (transaction) => {
      const updatedMenu = await menu.update(
        {
          date: request.date,
          deadlineAt:
            request.deadlineAt === undefined
              ? undefined
              : new Date(request.deadlineAt),
          title: request.title,
          description: request.description,
        },
        { transaction },
      );

      if (request.options !== undefined) {
        const keptIds = new Set(request.options.map((option) => option.id));
        const removedIds = menu.options
          .filter((option) => !keptIds.has(option.id))
          .map((option) => option.id);
        if (removedIds.length > 0) {
          await Order.update(
            { enabled: false },
            {
              where: {
                menuId: id,
                menuOptionId: { [Op.in]: removedIds },
                enabled: true,
              },
              transaction,
            },
          );
          await MenuOption.update(
            { enabled: false },
            {
              where: { menuId: id, id: { [Op.in]: removedIds }, enabled: true },
              transaction,
            },
          );
        }
        for (const option of request.options) {
          let savedOption: MenuOption;
          if (option.id !== undefined) {
            const currentOption = menu.options.find(
              (item) => item.id === option.id,
            );
            if (!currentOption) {
              throw new BadRequestError('Menu option does not exist');
            }
            savedOption = await currentOption.update(
              {
                name: option.name,
                description: option.description,
              },
              { transaction },
            );
          } else {
            savedOption = await MenuOption.create(
              {
                menuId: id,
                name: option.name,
                description: option.description ?? '',
                enabled: true,
              },
              { transaction },
            );
          }
          if (option.id === undefined || option.restrictionsId !== undefined) {
            await savedOption.$set(
              'dietaryRestrictions',
              [...new Set(option.restrictionsId ?? [])],
              { transaction },
            );
          }
        }
      }
      const options = await updatedMenu.$get('options', {
        where: { enabled: true },
        include: ['dietaryRestrictions'],
        transaction,
      });

      return this.toResponse(updatedMenu, options);
    });
  }

  public async deleteMenu(id: string, userId: string): Promise<void> {
    const menu = await this.findOwnedMenu(id, userId);

    await sequelize.transaction(async (transaction) => {
      await Order.update(
        { enabled: false },
        { where: { menuId: id, enabled: true }, transaction },
      );
      await MenuOption.update(
        { enabled: false },
        {
          where: { menuId: id, enabled: true },
          transaction,
        },
      );
      await menu.update({ enabled: false }, { transaction });
    });
  }

  private validateOptions(
    currentOptions: MenuOption[],
    requestedOptions: CreateOrUpdateMenuOptionRequest[],
  ): void {
    const activeIds = new Set(currentOptions.map((option) => option.id));
    const seenIds = new Set<string>();
    for (const option of requestedOptions) {
      if (option.id === undefined) {
        if (option.name === undefined) {
          throw new BadRequestError('New menu options require a name');
        }
        continue;
      }
      if (!activeIds.has(option.id)) {
        throw new BadRequestError(
          'Menu option does not exist, is deleted, or belongs to another menu',
        );
      }
      if (seenIds.has(option.id)) {
        throw new BadRequestError('Menu option IDs must not be repeated');
      }
      seenIds.add(option.id);
    }
  }

  private async validateRestrictions(
    options: { restrictionsId?: string[] }[],
  ): Promise<void> {
    const ids = [
      ...new Set(options.flatMap((option) => option.restrictionsId ?? [])),
    ];
    if (ids.length === 0) return;
    const restrictions = await DietaryRestriction.findAll({
      where: { id: { [Op.in]: ids }, enabled: true },
    });
    if (restrictions.length !== ids.length) {
      throw new BadRequestError(
        'Dietary restriction does not exist or has been deleted',
      );
    }
  }

  private async findOwnedMenu(id: string, userId: string): Promise<Menu> {
    const menu = await this.findMenu(id);
    if (menu.createdByUserId !== userId) {
      throw new ForbiddenError('Only the menu creator can modify this menu');
    }

    return menu;
  }

  private async findMenu(id: string): Promise<Menu> {
    const menu = await Menu.findOne({
      where: { id, enabled: true },
      include: [
        {
          association: 'options',
          where: { enabled: true },
          required: false,
          include: ['dietaryRestrictions'],
        },
      ],
    });
    if (!menu) {
      throw new NotFoundError('Menu not found');
    }

    return menu;
  }

  private toResponse(menu: Menu, options: MenuOption[]): MenuResponse {
    return {
      id: menu.id,
      date: menu.date,
      deadlineAt: menu.deadlineAt,
      title: menu.title,
      description: menu.description ?? '',
      enabled: menu.enabled,
      createdByUserId: menu.createdByUserId,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
      options: options.map((option) => ({
        id: option.id,
        menuId: option.menuId,
        name: option.name,
        description: option.description ?? '',
        restrictionsId: option.dietaryRestrictions.map(
          (restriction) => restriction.id,
        ),
        enabled: option.enabled,
        createdAt: option.createdAt,
        updatedAt: option.updatedAt,
      })),
    };
  }
}
