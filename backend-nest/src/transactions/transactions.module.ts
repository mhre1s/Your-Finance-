import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsService } from './transactions.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule], // Importa o AuthModule para ter acesso ao JwtAuthGuard
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
