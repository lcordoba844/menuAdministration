import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginResponse {
  @IsString()
  jwt!: string;
}

export class RegisterRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class RegisterResponse {
  @IsString()
  id!: string;

  @IsString()
  email!: string;
}
