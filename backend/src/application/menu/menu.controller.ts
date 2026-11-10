import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import {
  CreateMenuRequest,
  MenuResponse,
  UpdateMenuRequest,
} from '@/application/menu/menu.dto';
import { MenuService } from '@/application/menu/menu.service';
import {
  Authenticated,
  AuthenticatedRequest,
} from '@/middlewares/authenticated.decorator';

@JsonController('/menus')
@Authenticated()
@Service()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @OpenAPI({ summary: 'Get all menus' })
  @ResponseSchema(MenuResponse, { isArray: true })
  public async getMenus(): Promise<MenuResponse[]> {
    return await this.menuService.getAllMenus();
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get a menu' })
  @ResponseSchema(MenuResponse)
  public async getMenu(@Param('id') id: string): Promise<MenuResponse> {
    return await this.menuService.getMenu(id);
  }

  @Post()
  @HttpCode(201)
  @OpenAPI({ summary: 'Create a new menu with its options' })
  @ResponseSchema(MenuResponse)
  public async createMenu(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateMenuRequest,
  ): Promise<MenuResponse> {
    return await this.menuService.createMenu(request.auth.userId, body);
  }

  @Put('/:id')
  @OpenAPI({
    summary: 'Update a menu with its options',
  })
  @ResponseSchema(MenuResponse)
  public async updateMenu(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateMenuRequest,
  ): Promise<MenuResponse> {
    return await this.menuService.updateMenu(id, request.auth.userId, body);
  }

  @Delete('/:id')
  @HttpCode(204)
  @OnUndefined(204)
  @OpenAPI({ summary: 'Delete a menu and its options' })
  public async deleteMenu(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.menuService.deleteMenu(id, request.auth.userId);
  }
}
