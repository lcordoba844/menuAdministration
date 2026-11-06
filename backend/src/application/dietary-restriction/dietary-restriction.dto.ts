import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateDietaryRestrictionRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string | null;
}

export class UpdateDietaryRestrictionRequest {
  @ValidateIf(
    (_request: unknown, value: unknown): boolean => value !== undefined,
  )
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string | null;
}

export class DietaryRestrictionResponse {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description!: string | null;

  @IsBoolean()
  enabled!: boolean;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
