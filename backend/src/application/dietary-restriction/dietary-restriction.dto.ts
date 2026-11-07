import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateDietaryRestrictionRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @Length(0, 255)
  description: string = '';
}

export class UpdateDietaryRestrictionRequest {
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
  @Length(0, 255)
  description?: string;
}

export class DietaryRestrictionResponse {
  @IsString()
  id!: string;

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
