import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

@Injectable()
export class AuthService {
  // Injeção de dependência automática do PrismaService
  constructor(private readonly prisma: PrismaService) {}

  // 1. Cadastro de novos usuários
  async register(data: RegisterDto): Promise<AuthResponse> {
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestException('Todos os campos são obrigatórios: name, email, password.');
    }

    if (data.password.length < 6) {
      throw new BadRequestException('A senha deve ter no mínimo 6 caracteres.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email já cadastrado no sistema.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
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

    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
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

  // Método auxiliar para assinatura de JWT
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não configurado nas variáveis de ambiente.');
    }

    return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
  }
}
