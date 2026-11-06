import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateDinerRequest {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @IsUUID(4)
  officeId!: string;

  @IsUUID(4)
  departmentId!: string;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  dietaryRestrictionIds?: string[];
}

export class UpdateDinerRequest {
  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsString()
  @Length(1, 255)
  name?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsUUID(4)
  officeId?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsUUID(4)
  departmentId?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
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
