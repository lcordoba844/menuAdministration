import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateMenuOptionRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  description!: string;
}

export class UpdateMenuOptionRequest {
  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsString()
  @Length(1, 100)
  name?: string;

  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsString()
  @Length(1, 255)
  description?: string;
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

  @IsBoolean()
  enabled!: boolean;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
