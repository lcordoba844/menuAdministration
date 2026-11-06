import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import {
  CreateMenuOptionRequest,
  MenuOptionResponse,
  UpdateMenuOptionRequest,
} from '@/application/menu-option/menu-option.dto';
import { MenuOptionService } from '@/application/menu-option/menu-option.service';
import { Authenticated } from '@/middlewares/authenticated.decorator';

@JsonController('/menus/:menuId/options')
@Authenticated()
@Service()
export class MenuOptionController {
  constructor(private readonly menuOptionService: MenuOptionService) {}

  @Get()
  @OpenAPI({ summary: 'Get all menu options for a menu' })
  @ResponseSchema(MenuOptionResponse, { isArray: true })
  public async getMenuOptions(
    @Param('menuId') menuId: string,
  ): Promise<MenuOptionResponse[]> {
    return await this.menuOptionService.getMenuOptions(menuId);
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get a menu option' })
  @ResponseSchema(MenuOptionResponse)
  public async getMenuOption(
    @Param('menuId') menuId: string,
    @Param('id') id: string,
  ): Promise<MenuOptionResponse> {
    return await this.menuOptionService.getMenuOption(menuId, id);
  }

  @Post()
  @HttpCode(201)
  @OpenAPI({ summary: 'Create a new menu option' })
  @ResponseSchema(MenuOptionResponse)
  public async createMenuOption(
    @Param('menuId') menuId: string,
    @Body() request: CreateMenuOptionRequest,
  ): Promise<MenuOptionResponse> {
    return await this.menuOptionService.createMenuOption(menuId, request);
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update a menu option' })
  @ResponseSchema(MenuOptionResponse)
  public async updateMenuOption(
    @Param('menuId') menuId: string,
    @Param('id') id: string,
    @Body() request: UpdateMenuOptionRequest,
  ): Promise<MenuOptionResponse> {
    return await this.menuOptionService.updateMenuOption(menuId, id, request);
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({ summary: 'Delete a menu option' })
  public async deleteMenuOption(
    @Param('menuId') menuId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.menuOptionService.deleteMenuOption(menuId, id);
  }
}
