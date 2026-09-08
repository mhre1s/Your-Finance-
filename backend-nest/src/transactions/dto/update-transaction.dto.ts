import { TransactionType } from '@prisma/client';

/**
 * DTO para atualização parcial de transação existente.
 * Todos os campos são opcionais, permitindo atualizar apenas o que mudar.
 */
export class UpdateTransactionDto {
  type?: TransactionType;
  title?: string;
  expenseName?: string;
  value?: number;
  date?: string; // Formato "YYYY-MM-DD"
}
