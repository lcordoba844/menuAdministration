import {
  IsNumber,
  IsBoolean,
  IsOptional,
  Length,
  IsString,
  IsNotEmpty,
  IsLatitude,
  IsLongitude
} from 'class-validator';

export class GetOfficeQueryDto {
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

export class CreateOfficeDto {
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

export class UpdateOfficeDto {
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

export interface OfficeResponseDto {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}