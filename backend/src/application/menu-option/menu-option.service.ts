import { BadRequestError, NotFoundError } from 'routing-controllers';
import { ForeignKeyConstraintError } from 'sequelize';
import { Service } from 'typedi';

import {
  CreateMenuOptionRequest,
  MenuOptionResponse,
  UpdateMenuOptionRequest,
} from '@/application/menu-option/menu-option.dto';
import Menu from '@/models/menu.model';
import MenuOption from '@/models/menu_option.model';

@Service()
export class MenuOptionService {
  public async getMenuOptions(menuId: string): Promise<MenuOptionResponse[]> {
    await this.validateMenu(menuId);
    const options = await MenuOption.findAll({
      where: { menuId, enabled: true },
      order: [['createdAt', 'DESC']],
    });

    return options.map((option) => this.toResponse(option));
  }

  public async getMenuOption(
    menuId: string,
    id: string,
  ): Promise<MenuOptionResponse> {
    const option = await this.findMenuOption(menuId, id);

    return this.toResponse(option);
  }

  public async createMenuOption(
    menuId: string,
    request: CreateMenuOptionRequest,
  ): Promise<MenuOptionResponse> {
    await this.validateMenu(menuId);

    try {
      const option = await MenuOption.create({
        menuId,
        name: request.name,
        description: request.description,
        enabled: true,
      });

      return this.toResponse(option);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new BadRequestError('Menu does not exist');
      }
      throw error;
    }
  }

  public async updateMenuOption(
    menuId: string,
    id: string,
    request: UpdateMenuOptionRequest,
  ): Promise<MenuOptionResponse> {
    const option = await this.findMenuOption(menuId, id);
    const updatedOption = await option.update({
      name: request.name,
      description: request.description,
    });

    return this.toResponse(updatedOption);
  }

  public async deleteMenuOption(menuId: string, id: string): Promise<void> {
    const option = await this.findMenuOption(menuId, id);

    await option.update({ enabled: false });
  }

  private async findMenuOption(
    menuId: string,
    id: string,
  ): Promise<MenuOption> {
    await this.validateMenu(menuId);
    const option = await MenuOption.findOne({
      where: { id, menuId, enabled: true },
    });
    if (!option) {
      throw new NotFoundError('Menu option not found');
    }

    return option;
  }

  private async validateMenu(menuId: string): Promise<void> {
    const menu = await Menu.findOne({
      where: { id: menuId, isActive: true },
    });
    if (!menu) {
      throw new NotFoundError('Menu not found');
    }
  }

  private toResponse(option: MenuOption): MenuOptionResponse {
    return {
      id: option.id,
      menuId: option.menuId,
      name: option.name,
      description: option.description,
      enabled: option.enabled,
      createdAt: option.createdAt,
      updatedAt: option.updatedAt,
    };
  }
}
