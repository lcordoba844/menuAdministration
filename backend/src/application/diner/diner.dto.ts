import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
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

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
