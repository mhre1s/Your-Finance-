import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface GenericMessageResponse {
  message: string;
}

@Injectable()
export class AuthService {
  // Injeção de dependência do PrismaService e MailService
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // 1. Cadastro de novos usuários
  async register(data: RegisterDto): Promise<AuthResponse> {
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestException('Todos os campos são obrigatórios: name, email, password.');
    }

    if (data.password.length < 6) {
      throw new BadRequestException('A senha deve ter no mínimo 6 caracteres.');
    }

    const normalizedEmail = data.email.toLowerCase().trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new BadRequestException('Email já cadastrado no sistema.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  // 2. Login de usuário
  async login(data: LoginDto): Promise<AuthResponse> {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email e senha são obrigatórios.');
    }

    const normalizedEmail = data.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  // 3. Solicitação de recuperação de senha (Forgot Password)
  async forgotPassword(data: ForgotPasswordDto): Promise<GenericMessageResponse> {
    if (!data.email) {
      throw new BadRequestException('O e-mail é obrigatório.');
    }

    const normalizedEmail = data.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Proteção Anti-Enumeração: se o e-mail não existir, retorna a mesma resposta genérica
    if (!user) {
      return {
        message: 'Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.',
      };
    }

    // Gera token criptográfico aleatório (64 caracteres hexadecimais)
    const token = crypto.randomBytes(32).toString('hex');
    // Expiração em 15 minutos
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    await this.mailService.sendPasswordResetEmail(user.email, user.name, token);

    return {
      message: 'Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.',
    };
  }

  // 4. Redefinição de senha com validação de token e uso único (Reset Password)
  async resetPassword(data: ResetPasswordDto): Promise<GenericMessageResponse> {
    if (!data.token || !data.password) {
      throw new BadRequestException('Token e nova senha são obrigatórios.');
    }

    if (data.password.length < 6) {
      throw new BadRequestException('A nova senha deve ter no mínimo 6 caracteres.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: data.token,
        resetPasswordExpires: {
          gt: new Date(), // Deve ser maior que a hora atual (não expirado)
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token de recuperação inválido ou expirado.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Atualiza a senha e limpa o token imediatamente (garante uso único)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return {
      message: 'Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.',
    };
  }

  // Método auxiliar para assinatura de JWT
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não configurado nas variáveis de ambiente.');
    }

    return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
  }
}
