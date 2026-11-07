import { BadRequestError, NotFoundError } from 'routing-controllers';
import { ForeignKeyConstraintError, Op } from 'sequelize';
import { Service } from 'typedi';

import {
  CreateOrderRequest,
  OrderResponse,
  UpdateOrderRequest,
} from '@/application/order/order.dto';
import { sequelize } from '@/config/sequelize';
import DietaryRestriction from '@/models/dietary_restriction.model';
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
    await this.validateMenu(menuId);
    const orders = await Order.findAll({
      where: {
        menuId,
        placedByUserId: userId,
        targetKind: OrderTargetKind.SELF,
        targetUserId: userId,
        enabled: true,
      },
      include: ['dietaryRestrictions'],
      order: [['createdAt', 'DESC']],
    });

    return orders.map((order) =>
      this.toResponse(
        order,
        order.dietaryRestrictions.map((item) => item.id),
      ),
    );
  }

  public async getOrder(
    menuId: string,
    id: string,
    userId: string,
  ): Promise<OrderResponse> {
    await this.validateMenu(menuId);
    const order = await this.findOrder(menuId, id, userId);
    const restrictions = await order.$get('dietaryRestrictions');

    return this.toResponse(
      order,
      restrictions.map((item) => item.id),
    );
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
    const menuOptionId = await this.validateDecision(
      menuId,
      request.decisionKind,
      request.menuOptionId,
    );
    const restrictionIds = [...new Set(request.dietaryRestrictionIds ?? [])];
    await this.validateRestrictions(restrictionIds);

    try {
      return await sequelize.transaction(async (transaction) => {
        const order = await Order.create(
          {
            menuId,
            placedByUserId: userId,
            targetKind: OrderTargetKind.SELF,
            targetUserId: userId,
            targetGuestName: null,
            decisionKind: request.decisionKind,
            menuOptionId,
            comment: request.comment,
            enabled: true,
            lockedAt: null,
          },
          { transaction },
        );
        await order.$set('dietaryRestrictions', restrictionIds, {
          transaction,
        });

        return this.toResponse(order, restrictionIds);
      });
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
    const restrictionIds =
      request.dietaryRestrictionIds === undefined
        ? undefined
        : [...new Set(request.dietaryRestrictionIds)];
    if (restrictionIds !== undefined) {
      await this.validateRestrictions(restrictionIds);
    }

    try {
      return await sequelize.transaction(async (transaction) => {
        const updatedOrder = await order.update(
          { decisionKind, menuOptionId, comment: request.comment },
          { transaction },
        );
        if (restrictionIds !== undefined) {
          await updatedOrder.$set('dietaryRestrictions', restrictionIds, {
            transaction,
          });
        }
        const restrictions = await updatedOrder.$get('dietaryRestrictions', {
          transaction,
        });

        return this.toResponse(
          updatedOrder,
          restrictions.map((item) => item.id),
        );
      });
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

  private async validateMenu(menuId: string, forWrite = false): Promise<void> {
    const menu = await Menu.findOne({ where: { id: menuId, enabled: true } });
    if (!menu) {
      throw new NotFoundError('Menu not found');
    }
    if (forWrite && menu.deadlineAt.getTime() <= Date.now()) {
      throw new BadRequestError('The menu ordering deadline has passed');
    }
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

  private async validateRestrictions(
    restrictions_ids: string[],
  ): Promise<void> {
    if (restrictions_ids.length === 0) return;
    const restrictions = await DietaryRestriction.findAll({
      where: { id: { [Op.in]: restrictions_ids }, isActive: true },
    });
    if (restrictions.length !== restrictions_ids.length) {
      throw new BadRequestError(
        'Dietary restriction does not exist or has been deleted',
      );
    }
  }

  private toResponse(
    order: Order,
    dietaryRestrictionIds: string[],
  ): OrderResponse {
    return {
      id: order.id,
      menuId: order.menuId,
      placedByUserId: order.placedByUserId,
      targetKind: order.targetKind,
      targetUserId: order.targetUserId ?? null,
      targetGuestName: order.targetGuestName ?? null,
      decisionKind: order.decisionKind,
      menuOptionId: order.menuOptionId ?? null,
      comment: order.comment ?? null,
      dietaryRestrictionIds,
      enabled: order.enabled,
      lockedAt: order.lockedAt ?? null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
