import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from '@/application/auth/auth.dto';
import { environment } from '@/config/environment';
import { User } from '@/models/user.model';

@Service()
export class AuthService {
  public async login(request: LoginRequest): Promise<string> {
    const user = await User.findOne({ where: { email: request.email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string): string {
    const payload = { userId, email };
    const secret = environment.jwtSecret;

    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  public async createAccount(
    request: RegisterRequest
  ): Promise<RegisterResponse> {
    const existingUser = await User.findOne({
      where: { email: request.email },
    });
    if (existingUser) {
      throw new Error('Email already in use');
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
