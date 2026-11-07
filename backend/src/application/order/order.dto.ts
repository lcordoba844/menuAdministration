import { IsBoolean, IsDate, IsEnum, IsString, IsUUID } from 'class-validator';

import { OrderTargetKind } from '@/models/order.model';
import { IsNullable } from '@/shared/is-nullable.decorator';
import { IsOmittable } from '@/shared/is-omittable.decorator';

export class CreateOrderRequest {
  @IsOmittable()
  @IsNullable()
  @IsUUID(4)
  menuOptionId?: string | null;

  @IsString()
  comment: string = '';
}

export class UpdateOrderRequest {
  @IsOmittable()
  @IsNullable()
  @IsUUID(4)
  menuOptionId?: string | null;

  @IsOmittable()
  @IsString()
  comment?: string;
}

export class OrderResponse {
  @IsUUID(4)
  id!: string;

  @IsUUID(4)
  menuId!: string;

  @IsUUID(4)
  placedByUserId!: string;

  @IsEnum(OrderTargetKind)
  targetKind!: OrderTargetKind;

  @IsNullable()
  @IsUUID(4)
  targetUserId!: string | null;

  @IsNullable()
  @IsString()
  targetGuestName!: string | null;

  @IsNullable()
  @IsUUID(4)
  menuOptionId!: string | null;

  @IsString()
  comment!: string;

  @IsBoolean()
  enabled!: boolean;

  @IsNullable()
  @IsDate()
  lockedAt!: Date | null;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
