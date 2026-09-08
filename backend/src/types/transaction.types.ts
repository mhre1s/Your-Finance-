import { TransactionType } from '@prisma/client';

// Contrato para criação de uma nova transação (receita ou despesa)
export interface CreateTransactionDTO {
  type: TransactionType;
  title: string;
  expenseName?: string;
  value: number;
  date: string; // Formato "YYYY-MM-DD"
}

// Contrato para atualização parcial de uma transação existente
export interface UpdateTransactionDTO {
  type?: TransactionType;
  title?: string;
  expenseName?: string;
  value?: number;
  date?: string;
}
