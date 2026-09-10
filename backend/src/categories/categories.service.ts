import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna as categorias visíveis para o usuário autenticado:
   * 1. Categorias padrão globais do sistema (isDefault = true, userId = null)
   * 2. Categorias personalizadas criadas especificamente por este usuário (userId = userId)
   * Garante isolamento estrito: um usuário NUNCA verá as categorias criadas por outro.
   */
  async findAll(userId: string): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: {
        OR: [
          { isDefault: true, userId: null },
          { userId },
        ],
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Cria uma nova categoria personalizada para o usuário logado
   */
  async create(userId: string, data: CreateCategoryDto): Promise<Category> {
    // Validação de duplicidade para o mesmo usuário e tipo
    const existing = await this.prisma.category.findFirst({
      where: {
        name: { equals: data.name.trim(), mode: 'insensitive' },
        type: data.type,
        OR: [
          { userId },
          { isDefault: true, userId: null },
        ],
      },
    });

    if (existing) {
      throw new ConflictException(
        'Já existe uma categoria com este nome para este tipo de movimentação.',
      );
    }

    return await this.prisma.category.create({
      data: {
        name: data.name.trim(),
        type: data.type,
        color: data.color,
        icon: data.icon || null,
        isDefault: false,
        userId,
      },
    });
  }

  /**
   * Exclui uma categoria personalizada do usuário.
   * Categorias padrão do sistema (isDefault: true) ou pertencentes a outros usuários não podem ser excluídas.
   */
  async delete(userId: string, id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (category.isDefault || category.userId !== userId) {
      throw new ForbiddenException(
        'Você não possui permissão para excluir categorias padrão do sistema ou de terceiros.',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }
}