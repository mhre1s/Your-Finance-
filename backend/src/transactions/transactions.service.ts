import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionsService {
  // O PrismaService é injetado automaticamente pelo NestJS via Inversão de Controle
  constructor(private readonly prisma: PrismaService) {}

  // 1. Criação de transação vinculada obrigatoriamente ao usuário logado
  async create(userId: string, data: CreateTransactionDto): Promise<Transaction> {
    return await this.prisma.transaction.create({
      data: {
        type: data.type,
        title: data.title,
        expenseName: data.expenseName || null,
        value: data.value,
        date: new Date(data.date),
        userId,
      },
    });
  }

  // 2. Listagem de todas as transações do usuário logado (ordenadas por data decrescente)
  async findAll(userId: string): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  // 3. Busca de uma transação específica por ID (garantindo que pertence ao usuário)
  async findById(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      // No Express: res.status(404).json({ error: '...' })
      // No Nest: Lançamos NotFoundException nativa que automaticamente vira HTTP 404
      throw new NotFoundException('Transação não encontrada.');
    }

    return transaction;
  }

  // 4. Atualização parcial dos dados da transação
  async update(userId: string, id: string, data: UpdateTransactionDto): Promise<Transaction> {
    // Garante que a transação existe e pertence a este usuário antes de atualizar
    await this.findById(userId, id);

    return await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.title && { title: data.title }),
        ...(data.expenseName !== undefined && { expenseName: data.expenseName }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.date && { date: new Date(data.date) }),
      },
    });
  }

  // 5. Exclusão de transação
  async delete(userId: string, id: string): Promise<void> {
    // Garante posse antes de deletar
    await this.findById(userId, id);

    await this.prisma.transaction.delete({
      where: { id },
    });
  }
}
