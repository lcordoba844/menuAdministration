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
  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
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

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsString()
  @Length(0, 255)
  description?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
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

  @IsString()
  @Length(0, 255)
  description: string = '';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuOptionRequest)
  options!: CreateMenuOptionRequest[];
}

export class UpdateMenuRequest {
  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsDateString({ strict: true, strictSeparator: true })
  @Matches(/T.*(?:Z|[+-]\d{2}:\d{2})$/)
  deadlineAt?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsString()
  @Length(1, 100)
  title?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsString()
  @Length(0, 255)
  description?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
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
  description!: string;

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
