import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  // Injeção de dependência automática do AuthService
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Retorna status 201 Created
  async register(@Body() data: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Retorna status 200 OK
  async login(@Body() data: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(data);
  }
}
