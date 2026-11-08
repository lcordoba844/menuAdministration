import { Body, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/application/auth/auth.dto';
import { AuthService } from '@/application/auth/auth.service';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @OpenAPI({
    summary: 'Authenticate user and retrieve a JWT',
    responses: {
      '401': { description: 'Invalid credentials or disabled account' },
    },
  })
  @ResponseSchema(LoginResponse)
  public async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    const jwt = await this.authService.login(request);
    return { jwt };
  }

  @Post('/register')
  @OpenAPI({
    summary: 'Create a new user account',
    responses: {
      '409': { description: 'Email already in use' },
    },
  })
  @ResponseSchema(RegisterResponse)
  public async register(
    @Body() request: RegisterRequest,
  ): Promise<RegisterResponse> {
    return await this.authService.createAccount(request);
  }
}
