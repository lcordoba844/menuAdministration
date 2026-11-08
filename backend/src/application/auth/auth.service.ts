import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { HttpError, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';

import {
  AuthPayload,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from '@/application/auth/auth.dto';
import { environment } from '@/config/environment';
import User from '@/models/user.model';

@Service()
export class AuthService {
  public async login(request: LoginRequest): Promise<string> {
    const user = await User.findOne({ where: { email: request.email } });
    if (!user || !user.enabled) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return this.generateToken({
      userId: user.id,
      role: user.role,
    });
  }

  private generateToken(payload: AuthPayload): string {
    const secret = environment.jwtSecret;

    return jwt.sign(payload, secret, {
      expiresIn: environment.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  public async createAccount(
    request: RegisterRequest,
  ): Promise<RegisterResponse> {
    const existingUser = await User.findOne({
      where: { email: request.email },
    });
    if (existingUser) {
      throw new HttpError(409, 'Email already in use');
    }

    const saltRounds = 10;
    const password = await bcrypt.hash(request.password, saltRounds);

    const user = await User.create({
      email: request.email,
      password,
    });

    return {
      id: user.id,
      email: user.email,
    };
  }
}
