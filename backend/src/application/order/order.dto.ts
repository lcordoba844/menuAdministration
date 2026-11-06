import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

import { DecisionKind, OrderTargetKind } from '@/models/order.model';

export class CreateOrderRequest {
  @IsEnum(DecisionKind)
  decisionKind!: DecisionKind;

  @IsOptional()
  @IsUUID(4)
  menuOptionId?: string | null;

  @IsOptional()
  @IsString()
  comment?: string | null;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsArray()
  @IsUUID(4, { each: true })
  dietaryRestrictionIds?: string[];
}

export class UpdateOrderRequest {
  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsEnum(DecisionKind)
  decisionKind?: DecisionKind;

  @IsOptional()
  @IsUUID(4)
  menuOptionId?: string | null;

  @IsOptional()
  @IsString()
  comment?: string | null;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsArray()
  @IsUUID(4, { each: true })
  dietaryRestrictionIds?: string[];
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

  @IsEnum(DecisionKind)
  decisionKind!: DecisionKind;

  @IsOptional()
  @IsUUID(4)
  menuOptionId!: string | null;

  @IsOptional()
  @IsString()
  comment!: string | null;

  @IsArray()
  @IsUUID(4, { each: true })
  dietaryRestrictionIds!: string[];

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
