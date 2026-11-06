import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
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
  @OpenAPI({ summary: 'Create a new menu' })
  @ResponseSchema(MenuResponse)
  public async createMenu(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateMenuRequest,
  ): Promise<MenuResponse> {
    return await this.menuService.createMenu(request.auth.userId, body);
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update a menu' })
  @ResponseSchema(MenuResponse)
  public async updateMenu(
    @Param('id') id: string,
    @Body() request: UpdateMenuRequest,
  ): Promise<MenuResponse> {
    return await this.menuService.updateMenu(id, request);
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({ summary: 'Delete a menu' })
  public async deleteMenu(@Param('id') id: string): Promise<void> {
    await this.menuService.deleteMenu(id);
  }
}
