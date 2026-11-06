import { BadRequestError, HttpError, NotFoundError } from 'routing-controllers';
import { ForeignKeyConstraintError } from 'sequelize';
import { Service } from 'typedi';

import {
  CreateOrderRequest,
  OrderResponse,
  UpdateOrderRequest,
} from '@/application/order/order.dto';
import Diner from '@/models/diner.model';
import Menu from '@/models/menu.model';
import MenuOption from '@/models/menu_option.model';
import Order, { DecisionKind, OrderTargetKind } from '@/models/order.model';
import User from '@/models/user.model';

@Service()
export class OrderService {
  public async getOrders(
    menuId: string,
    userId: string,
  ): Promise<OrderResponse[]> {
    const menu = await this.validateMenu(menuId);
    const orders = await Order.findAll({
      where: {
        menuId,
        enabled: true,
        ...(menu.createdByUserId === userId ? {} : { placedByUserId: userId }),
      },
      order: [['createdAt', 'DESC']],
    });

    return orders.map((order) => this.toResponse(order));
  }

  public async getOrder(
    menuId: string,
    id: string,
    userId: string,
  ): Promise<OrderResponse> {
    const menu = await this.validateMenu(menuId);
    const order = await Order.findOne({
      where: {
        id,
        menuId,
        enabled: true,
        ...(menu.createdByUserId === userId ? {} : { placedByUserId: userId }),
      },
    });
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return this.toResponse(order);
  }

  public async createOrder(
    menuId: string,
    userId: string,
    request: CreateOrderRequest,
  ): Promise<OrderResponse> {
    await this.validateMenu(menuId, true);
    const user = await User.findOne({ where: { id: userId, enabled: true } });
    if (!user) {
      throw new BadRequestError('User does not exist or has been deleted');
    }
    const diner = await Diner.findOne({ where: { userId, enabled: true } });
    if (!diner) {
      throw new BadRequestError('User must have an enabled diner profile');
    }
    const existingOrder = await Order.findOne({
      where: { menuId, targetUserId: userId, enabled: true },
    });
    if (existingOrder) {
      throw new HttpError(
        409,
        'This diner already has an active order for this menu',
      );
    }
    const menuOptionId = await this.validateDecision(
      menuId,
      request.decisionKind,
      request.menuOptionId,
    );
    try {
      const order = await Order.create({
        menuId,
        placedByUserId: userId,
        targetKind: OrderTargetKind.SELF,
        targetUserId: userId,
        targetGuestName: null,
        decisionKind: request.decisionKind,
        menuOptionId,
        comment: request.comment ?? '',
        enabled: true,
        lockedAt: null,
      });

      return this.toResponse(order);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new BadRequestError('An order reference does not exist');
      }
      throw error;
    }
  }

  public async updateOrder(
    menuId: string,
    id: string,
    userId: string,
    request: UpdateOrderRequest,
  ): Promise<OrderResponse> {
    const order = await this.findOrder(menuId, id, userId);
    await this.validateMenu(menuId, true);
    const decisionKind = request.decisionKind ?? order.decisionKind;
    let menuOptionId = order.menuOptionId;
    if (
      request.decisionKind !== undefined ||
      request.menuOptionId !== undefined
    ) {
      menuOptionId = await this.validateDecision(
        menuId,
        decisionKind,
        request.menuOptionId === undefined
          ? decisionKind === DecisionKind.NO_ORDER
            ? null
            : order.menuOptionId
          : request.menuOptionId,
      );
    }
    try {
      const updatedOrder = await order.update({
        decisionKind,
        menuOptionId,
        comment: request.comment,
      });

      return this.toResponse(updatedOrder);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new BadRequestError('An order reference does not exist');
      }
      throw error;
    }
  }

  public async deleteOrder(
    menuId: string,
    id: string,
    userId: string,
  ): Promise<void> {
    const order = await this.findOrder(menuId, id, userId);
    await this.validateMenu(menuId, true);

    await order.update({ enabled: false });
  }

  private async findOrder(
    menuId: string,
    id: string,
    userId: string,
  ): Promise<Order> {
    const order = await Order.findOne({
      where: {
        id,
        menuId,
        placedByUserId: userId,
        targetKind: OrderTargetKind.SELF,
        targetUserId: userId,
        enabled: true,
      },
    });
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
  }

  private async validateMenu(menuId: string, forWrite = false): Promise<Menu> {
    const menu = await Menu.findOne({ where: { id: menuId, enabled: true } });
    if (!menu) {
      throw new NotFoundError('Menu not found');
    }
    if (forWrite && menu.deadlineAt.getTime() <= Date.now()) {
      throw new BadRequestError('The menu ordering deadline has passed');
    }

    return menu;
  }

  private async validateDecision(
    menuId: string,
    decisionKind: DecisionKind,
    menuOptionId?: string | null,
  ): Promise<string | null> {
    if (decisionKind === DecisionKind.NO_ORDER) {
      if (menuOptionId != null) {
        throw new BadRequestError(
          'A no-order decision cannot select a menu option',
        );
      }
      return null;
    }
    if (!menuOptionId) {
      throw new BadRequestError('An option decision requires a menu option');
    }
    const option = await MenuOption.findOne({
      where: { id: menuOptionId, menuId, enabled: true },
    });
    if (!option) {
      throw new BadRequestError(
        'Menu option does not exist, is deleted, or belongs to another menu',
      );
    }

    return menuOptionId;
  }

  private toResponse(order: Order): OrderResponse {
    return {
      id: order.id,
      menuId: order.menuId,
      placedByUserId: order.placedByUserId,
      targetKind: order.targetKind,
      targetUserId: order.targetUserId ?? null,
      targetGuestName: order.targetGuestName ?? null,
      decisionKind: order.decisionKind,
      menuOptionId: order.menuOptionId ?? null,
      comment: order.comment ?? '',
      enabled: order.enabled,
      lockedAt: order.lockedAt ?? null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
