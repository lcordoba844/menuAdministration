import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string | null;
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

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string | null;
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

  @IsOptional()
  @IsString()
  description!: string | null;

  @IsBoolean()
  enabled!: boolean;

  @IsUUID(4)
  createdByUserId!: string;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
