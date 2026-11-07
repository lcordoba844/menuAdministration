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
  CreateOrderRequest,
  OrderResponse,
  UpdateOrderRequest,
} from '@/application/order/order.dto';
import { OrderService } from '@/application/order/order.service';
import {
  Authenticated,
  AuthenticatedRequest,
} from '@/middlewares/authenticated.decorator';

@JsonController('/menus/:menuId/orders')
@Authenticated()
@Service()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @OpenAPI({
    summary: 'Get self-orders for the authenticated user for a menu',
  })
  @ResponseSchema(OrderResponse, { isArray: true })
  public async getOrders(
    @Param('menuId') menuId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<OrderResponse[]> {
    return await this.orderService.getOrders(menuId, request.auth.userId);
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get a self-order for the authenticated user' })
  @ResponseSchema(OrderResponse)
  public async getOrder(
    @Param('menuId') menuId: string,
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<OrderResponse> {
    return await this.orderService.getOrder(menuId, id, request.auth.userId);
  }

  @Post()
  @HttpCode(201)
  @OpenAPI({ summary: 'Create a self-order for the authenticated user' })
  @ResponseSchema(OrderResponse)
  public async createOrder(
    @Param('menuId') menuId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateOrderRequest,
  ): Promise<OrderResponse> {
    return await this.orderService.createOrder(
      menuId,
      request.auth.userId,
      body,
    );
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update a self-order for the authenticated user' })
  @ResponseSchema(OrderResponse)
  public async updateOrder(
    @Param('menuId') menuId: string,
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateOrderRequest,
  ): Promise<OrderResponse> {
    return await this.orderService.updateOrder(
      menuId,
      id,
      request.auth.userId,
      body,
    );
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({ summary: 'Delete a self-order for the authenticated user' })
  public async deleteOrder(
    @Param('menuId') menuId: string,
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.orderService.deleteOrder(menuId, id, request.auth.userId);
  }
}
