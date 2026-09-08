import { prisma } from '../prisma';
import { CreateTransactionDTO, UpdateTransactionDTO } from '../types/transaction.types';
import { Transaction } from '@prisma/client';

export class TransactionService {
  // 1. Criação de transação vinculada obrigatoriamente ao usuário logado
  async create(userId: string, data: CreateTransactionDTO): Promise<Transaction> {
    return await prisma.transaction.create({
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

  // 2. Listagem de todas as transações do usuário (ordenadas por data decrescente)
  async findAll(userId: string): Promise<Transaction[]> {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  // 3. Busca de uma transação específica por ID (garantindo que pertence ao usuário)
  async findById(userId: string, id: string): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada.');
    }

    return transaction;
  }

  // 4. Atualização de dados da transação
  async update(userId: string, id: string, data: UpdateTransactionDTO): Promise<Transaction> {
    // Garante que a transação existe e pertence a este usuário antes de atualizar
    await this.findById(userId, id);

    return await prisma.transaction.update({
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

    await prisma.transaction.delete({
      where: { id },
    });
  }
}
