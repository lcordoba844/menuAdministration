import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

import { IsOmittable } from '@/shared/is-omittable.decorator';

export class CreateDepartmentRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsOmittable()
  @IsString()
  @Length(0, 255)
  description: string = '';
}

export class UpdateDepartmentRequest {
  @IsOmittable()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOmittable()
  @IsString()
  @Length(0, 255)
  description: string = '';
}

export class DepartmentResponse {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  description: string = '';

  @IsBoolean()
  enabled!: boolean;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
