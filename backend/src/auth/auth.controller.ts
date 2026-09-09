import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService, AuthResponse, GenericMessageResponse } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'E-mail já cadastrado ou dados inválidos.' })
  async register(@Body() data: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login e obter token JWT' })
  @ApiResponse({ status: 200, description: 'Login autenticado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() data: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(data);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar e-mail de recuperação de senha (Forgot Password)' })
  @ApiResponse({ status: 200, description: 'Resposta genérica de confirmação de envio.' })
  @ApiResponse({ status: 400, description: 'E-mail não fornecido.' })
  async forgotPassword(@Body() data: ForgotPasswordDto): Promise<GenericMessageResponse> {
    return await this.authService.forgotPassword(data);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redefinir senha usando token criptográfico (Reset Password)' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token inválido/expirado ou senha muito curta.' })
  async resetPassword(@Body() data: ResetPasswordDto): Promise<GenericMessageResponse> {
    return await this.authService.resetPassword(data);
  }
}
