import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { IsOmittable } from '@/shared/is-omittable.decorator';

export class CreateMenuOptionRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @Length(0, 255)
  description: string = '';

  @IsArray()
  @IsUUID(4, { each: true })
  restrictionsId: string[] = [];
}

export class CreateOrUpdateMenuOptionRequest {
  @IsOmittable()
  @IsUUID(4)
  id?: string;

  @ValidateIf(
    (request: CreateOrUpdateMenuOptionRequest, value: unknown): boolean =>
      request.id === undefined || value !== undefined,
  )
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOmittable()
  @IsString()
  @Length(0, 255)
  description?: string;

  @IsOmittable()
  @IsArray()
  @IsUUID(4, { each: true })
  restrictionsId?: string[];
}

export class MenuOptionResponse {
  @IsUUID(4)
  id!: string;

  @IsUUID(4)
  menuId!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  @IsUUID(4, { each: true })
  restrictionsId!: string[];

  @IsBoolean()
  enabled!: boolean;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}

export class CreateMenuRequest {
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @IsDateString({ strict: true, strictSeparator: true })
  @Matches(/T.*(?:Z|[+-]\d{2}:\d{2})$/)
  deadlineAt!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  title!: string;

  @IsOmittable()
  @IsString()
  @Length(0, 255)
  description: string = '';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuOptionRequest)
  options!: CreateMenuOptionRequest[];
}

export class UpdateMenuRequest {
  @IsOmittable()
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @IsOmittable()
  @IsDateString({ strict: true, strictSeparator: true })
  @Matches(/T.*(?:Z|[+-]\d{2}:\d{2})$/)
  deadlineAt?: string;

  @IsOmittable()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOmittable()
  @IsString()
  @Length(0, 255)
  description: string = '';

  @IsOmittable()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrUpdateMenuOptionRequest)
  options?: CreateOrUpdateMenuOptionRequest[];
}

export class MenuResponse {
  @IsUUID(4)
  id!: string;

  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @IsDate()
  deadlineAt!: Date;

  @IsString()
  title!: string;

  @IsString()
  description: string = '';

  @IsBoolean()
  enabled!: boolean;

  @IsUUID(4)
  createdByUserId!: string;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuOptionResponse)
  options!: MenuOptionResponse[];
}
