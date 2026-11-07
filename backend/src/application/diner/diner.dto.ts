import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { IsOmittable } from '@/shared/is-omittable.decorator';

export class CreateDinerRequest {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @IsUUID(4)
  officeId!: string;

  @IsUUID(4)
  departmentId!: string;

  @IsOmittable()
  @IsArray()
  @IsUUID(4, { each: true })
  dietaryRestrictionIds?: string[];
}

export class UpdateDinerRequest {
  @IsOmittable()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOmittable()
  @IsUUID(4)
  officeId?: string;

  @IsOmittable()
  @IsUUID(4)
  departmentId?: string;

  @IsOmittable()
  @IsArray()
  @IsUUID(4, { each: true })
  dietaryRestrictionIds?: string[];
}

export class DinerResponse {
  @IsUUID(4)
  id!: string;

  @IsString()
  name!: string;

  @IsUUID(4)
  userId!: string;

  @IsUUID(4)
  officeId!: string;

  @IsUUID(4)
  departmentId!: string;

  @IsArray()
  @IsUUID(4, { each: true })
  dietaryRestrictionIds!: string[];

  @IsBoolean()
  enabled!: boolean;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
