import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { RegisterDTO, LoginDTO, AuthResponseDTO } from '../types/auth.types';

export class AuthService {
  //  Cadastro de novos usuários
  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    // Validação de unicidade de email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado no sistema.');
    }

    // Criptografia da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Persistência no PostgreSQL
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // Emissão do token JWT
    const token = this.generateToken(user.id);

    // Retorno campos públicos + token 
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  // Login com verificação de hash
  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    // Busca do usuário pelo email único
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    // Comparação do hash seguro com a senha fornecida
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas.');
    }

    // Emissão do token JWT
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

  // Método auxiliar privado para assinar o token JWT
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não configurado nas variáveis de ambiente.');
    }

    // Token expira em 7 dias; payload com Subject padrão (sub = userId)
    return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
  }
}
