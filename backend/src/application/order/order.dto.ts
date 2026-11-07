import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

import { OrderTargetKind } from '@/models/order.model';

export class CreateOrderRequest {
  @IsOptional()
  @IsUUID(4)
  menuOptionId?: string | null;

  @IsString()
  comment: string = '';
}

export class UpdateOrderRequest {
  @IsOptional()
  @IsUUID(4)
  menuOptionId?: string | null;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
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

  @IsOptional()
  @IsUUID(4)
  targetUserId!: string | null;

  @IsOptional()
  @IsString()
  targetGuestName!: string | null;

  @IsOptional()
  @IsUUID(4)
  menuOptionId!: string | null;

  @IsString()
  comment!: string;

  @IsBoolean()
  enabled!: boolean;

  @IsOptional()
  @IsDate()
  lockedAt!: Date | null;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
