import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { JwtPayload } from 'jsonwebtoken';

import type { UserRole } from '@/models/user.model';

export interface AuthPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

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
