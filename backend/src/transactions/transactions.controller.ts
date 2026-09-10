import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Req, 
  UseGuards, 
  HttpCode, 
  HttpStatus, 
  BadRequestException 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { TransactionsService } from './transactions.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Transaction } from '@prisma/client';

/**
 * Controller de Transações
 * 
 * 🛡️ @UseGuards(JwtAuthGuard): Aplica a proteção de JWT em TODAS as rotas deste controller.
 * 📚 @ApiTags('Transações') e @ApiBearerAuth('JWT-auth'): Documentação interativa no Swagger.
 */
@ApiTags('Transações')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova transação (Recebimento ou Despesa)' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado (Token ausente ou expirado).' })
  async create(
    @Req() req: Request, 
    @Body() data: CreateTransactionDto
  ): Promise<Transaction> {
    if (data.type !== 'RECEBIMENTO' && data.type !== 'DESPESA') {
      throw new BadRequestException('O tipo deve ser RECEBIMENTO ou DESPESA.');
    }
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      throw new BadRequestException('O título ou categoria é obrigatório.');
    }
    const numericValue = Number(data.value);
    if (isNaN(numericValue) || numericValue <= 0) {
      throw new BadRequestException('O valor deve ser um número positivo maior que zero.');
    }
    if (!data.date || isNaN(Date.parse(data.date))) {
      throw new BadRequestException('Data inválida. Forneça uma data no formato YYYY-MM-DD.');
    }

    const idempotencyKey = (
      req.headers['x-idempotency-key'] ||
      req.headers['idempotency-key']
    ) as string | undefined;

    return await this.transactionsService.create(
      req.userId!,
      {
        ...data,
        value: numericValue,
      },
      idempotencyKey,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as transações do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de transações retornada com sucesso.' })
  async findAll(@Req() req: Request): Promise<Transaction[]> {
    return await this.transactionsService.findAll(req.userId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma transação específica por ID' })
  @ApiResponse({ status: 200, description: 'Transação encontrada.' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada.' })
  async findById(
    @Req() req: Request, 
    @Param('id') id: string
  ): Promise<Transaction> {
    return await this.transactionsService.findById(req.userId!, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma transação existente' })
  @ApiResponse({ status: 200, description: 'Transação atualizada.' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada.' })
  async update(
    @Req() req: Request, 
    @Param('id') id: string, 
    @Body() data: UpdateTransactionDto
  ): Promise<Transaction> {
    const numericValue = data.value !== undefined ? Number(data.value) : undefined;
    if (numericValue !== undefined && (isNaN(numericValue) || numericValue <= 0)) {
      throw new BadRequestException('O valor deve ser um número positivo maior que zero.');
    }

    return await this.transactionsService.update(req.userId!, id, {
      ...data,
      ...(numericValue !== undefined && { value: numericValue }),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma transação' })
  @ApiResponse({ status: 204, description: 'Transação excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada.' })
  async delete(
    @Req() req: Request, 
    @Param('id') id: string
  ): Promise<void> {
    await this.transactionsService.delete(req.userId!, id);
  }
}
