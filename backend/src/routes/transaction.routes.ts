import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const transactionRoutes = Router();
const controller = new TransactionController();

// Todas as rotas de transação são estritamente protegidas por autenticação JWT
transactionRoutes.use(authMiddleware);

transactionRoutes.post('/', (req, res) => {
  controller.create(req, res);
});

transactionRoutes.get('/', (req, res) => {
  controller.findAll(req, res);
});

transactionRoutes.get('/:id', (req, res) => {
  controller.findById(req, res);
});

transactionRoutes.put('/:id', (req, res) => {
  controller.update(req, res);
});

transactionRoutes.delete('/:id', (req, res) => {
  controller.delete(req, res);
});
