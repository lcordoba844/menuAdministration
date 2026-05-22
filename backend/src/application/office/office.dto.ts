import {
  IsBoolean,
  IsDate,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class GetOfficeQuery {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  country?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

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
  @IsLatitude()
  latitude!: number;

  @IsNotEmpty()
  @IsLongitude()
  longitude!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateOfficeRequest {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  country?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
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

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsBoolean()
  isActive!: boolean;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
