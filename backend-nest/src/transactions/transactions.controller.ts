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
 * Nenhuma requisição entra aqui se não tiver um Bearer Token válido no header.
 */
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  // Injeção de dependência do Service
  constructor(private readonly transactionsService: TransactionsService) {}

  // POST /transactions
  @Post()
  @HttpCode(HttpStatus.CREATED) // Status 201
  async create(
    @Req() req: Request, 
    @Body() data: CreateTransactionDto
  ): Promise<Transaction> {
    // Validações básicas de entrada
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

    return await this.transactionsService.create(req.userId!, {
      ...data,
      value: numericValue,
    });
  }

  // GET /transactions
  @Get()
  async findAll(@Req() req: Request): Promise<Transaction[]> {
    return await this.transactionsService.findAll(req.userId!);
  }

  // GET /transactions/:id
  @Get(':id')
  async findById(
    @Req() req: Request, 
    @Param('id') id: string
  ): Promise<Transaction> {
    return await this.transactionsService.findById(req.userId!, id);
  }

  // PUT /transactions/:id
  @Put(':id')
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

  // DELETE /transactions/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Status 204 No Content
  async delete(
    @Req() req: Request, 
    @Param('id') id: string
  ): Promise<void> {
    await this.transactionsService.delete(req.userId!, id);
  }
}
