import { TransactionType } from '@prisma/client';

/**
 * DTO para criação de transação no NestJS.
 * 
 * No Express, usávamos interfaces puras: `interface CreateTransactionDTO`.
 * No NestJS, usamos CLASSES porque classes permanecem no JavaScript após a compilação,
 * permitindo validações automáticas em tempo de execução e documentação.
 */
export class CreateTransactionDto {
  type!: TransactionType;
  title!: string;
  expenseName?: string;
  value!: number;
  date!: string; // Formato "YYYY-MM-DD"
  categoryId?: string;
}
