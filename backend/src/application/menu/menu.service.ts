import { BadRequestError, NotFoundError } from 'routing-controllers';
import { ForeignKeyConstraintError } from 'sequelize';
import { Service } from 'typedi';

import {
  CreateMenuRequest,
  MenuResponse,
  UpdateMenuRequest,
} from '@/application/menu/menu.dto';
import Menu from '@/models/menu.model';
import User from '@/models/user.model';

@Service()
export class MenuService {
  public async getAllMenus(): Promise<MenuResponse[]> {
    const menus = await Menu.findAll({
      where: { enabled: true },
      order: [['createdAt', 'DESC']],
    });

    return menus.map((menu) => this.toResponse(menu));
  }

  public async getMenu(id: string): Promise<MenuResponse> {
    const menu = await this.findMenu(id);

    return this.toResponse(menu);
  }

  public async createMenu(
    userId: string,
    request: CreateMenuRequest,
  ): Promise<MenuResponse> {
    const user = await User.findOne({ where: { id: userId, enabled: true } });
    if (!user) {
      throw new BadRequestError('User does not exist or has been deleted');
    }

    try {
      const menu = await Menu.create({
        date: request.date,
        deadlineAt: new Date(request.deadlineAt),
        title: request.title,
        description: request.description,
        enabled: true,
        createdByUserId: userId,
      });

      return this.toResponse(menu);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new BadRequestError('User does not exist');
      }
      throw error;
    }
  }

  public async updateMenu(
    id: string,
    request: UpdateMenuRequest,
  ): Promise<MenuResponse> {
    const menu = await this.findMenu(id);
    const updatedMenu = await menu.update({
      date: request.date,
      deadlineAt:
        request.deadlineAt === undefined
          ? undefined
          : new Date(request.deadlineAt),
      title: request.title,
      description: request.description,
    });

    return this.toResponse(updatedMenu);
  }

  public async deleteMenu(id: string): Promise<void> {
    const menu = await this.findMenu(id);

    await menu.update({ enabled: false });
  }

  private async findMenu(id: string): Promise<Menu> {
    const menu = await Menu.findOne({ where: { id, enabled: true } });
    if (!menu) {
      throw new NotFoundError('Menu not found');
    }

    return menu;
  }

  private toResponse(menu: Menu): MenuResponse {
    return {
      id: menu.id,
      date: menu.date,
      deadlineAt: menu.deadlineAt,
      title: menu.title,
      description: menu.description ?? null,
      enabled: menu.enabled,
      createdByUserId: menu.createdByUserId,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }
}
