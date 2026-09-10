import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Category } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

@ApiTags('Categorias')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar categorias visíveis para o usuário logado (padrão + personalizadas)',
  })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async findAll(@Req() req: AuthenticatedRequest): Promise<Category[]> {
    const userId = req.userId;
    if (!userId) {
      throw new BadRequestException('Usuário não autenticado.');
    }
    return await this.categoriesService.findAll(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova categoria personalizada para o usuário' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Categoria já existente para este tipo.' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateCategoryDto,
  ): Promise<Category> {
    const userId = req.userId;
    if (!userId) {
      throw new BadRequestException('Usuário não autenticado.');
    }
    if (!data.name || data.name.trim().length === 0) {
      throw new BadRequestException('O nome da categoria é obrigatório.');
    }
    if (data.type !== 'RECEBIMENTO' && data.type !== 'DESPESA') {
      throw new BadRequestException('O tipo da categoria deve ser RECEBIMENTO ou DESPESA.');
    }
    if (!data.color || !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(data.color)) {
      throw new BadRequestException('A cor deve ser um código hexadecimal válido (ex: #f43f5e).');
    }

    return await this.categoriesService.create(userId, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir categoria personalizada do usuário' })
  @ApiResponse({ status: 204, description: 'Categoria excluída com sucesso.' })
  @ApiResponse({ status: 403, description: 'Não permitido excluir categorias padrão ou de terceiros.' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  async delete(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = req.userId;
    if (!userId) {
      throw new BadRequestException('Usuário não autenticado.');
    }
    await this.categoriesService.delete(userId, id);
  }
}