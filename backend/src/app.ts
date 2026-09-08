import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.routes';
import { transactionRoutes } from './routes/transaction.routes';

export const app: Express = express();

// Middlewares globais essenciais
app.use(cors());
app.use(express.json());

// Rota de verificação de saúde da API
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Registro de rotas modulares
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
