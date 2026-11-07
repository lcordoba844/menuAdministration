import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

import { IsOmittable } from '@/shared/is-omittable.decorator';

export class CreateOfficeRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  city!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  country!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  address!: string;
}

export class UpdateOfficeRequest {
  @IsOmittable()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOmittable()
  @IsString()
  @Length(1, 100)
  city?: string;

  @IsOmittable()
  @IsString()
  @Length(1, 100)
  country?: string;

  @IsOmittable()
  @IsString()
  @Length(1, 255)
  address?: string;
}

export class OfficeResponse {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  city!: string;

  @IsString()
  country!: string;

  @IsString()
  address!: string;

  @IsBoolean()
  enabled!: boolean;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
