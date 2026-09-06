import { PrismaClient } from '@prisma/client';

// Padrão Singleton: reaproveita uma única conexão do Prisma em toda a aplicação
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
