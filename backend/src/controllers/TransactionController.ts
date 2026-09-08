import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';

const transactionService = new TransactionService();

export class TransactionController {
  // POST /transactions
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Acesso não autorizado: usuário não identificado.' });
      }

      const { type, title, expenseName, value, date } = req.body;

      // Validação de tipo enum
      if (type !== 'RECEBIMENTO' && type !== 'DESPESA') {
        return res.status(400).json({ error: 'O tipo deve ser obrigatoriamente RECEBIMENTO ou DESPESA.' });
      }

      // Validação de título/categoria
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'O título ou categoria é obrigatório.' });
      }

      // Validação de valor monetário
      const numericValue = Number(value);
      if (isNaN(numericValue) || numericValue <= 0) {
        return res.status(400).json({ error: 'O valor deve ser um número positivo maior que zero.' });
      }

      // Validação de data ISO (YYYY-MM-DD)
      if (typeof date !== 'string' || isNaN(Date.parse(date))) {
        return res.status(400).json({ error: 'Data inválida. Forneça uma data no formato YYYY-MM-DD.' });
      }

      const transaction = await transactionService.create(userId, {
        type,
        title,
        expenseName: typeof expenseName === 'string' && expenseName.trim() ? expenseName.trim() : undefined,
        value: numericValue,
        date,
      });

      return res.status(201).json(transaction);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar transação.';
      return res.status(400).json({ error: message });
    }
  }

  // GET /transactions
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Acesso não autorizado.' });
      }

      const transactions = await transactionService.findAll(userId);
      return res.status(200).json(transactions);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao listar transações.';
      return res.status(500).json({ error: message });
    }
  }

  // GET /transactions/:id
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ error: 'Acesso não autorizado.' });
      }

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID da transação inválido.' });
      }

      const transaction = await transactionService.findById(userId, id);
      return res.status(200).json(transaction);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transação não encontrada.';
      return res.status(404).json({ error: message });
    }
  }

  // PUT /transactions/:id
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ error: 'Acesso não autorizado.' });
      }

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID da transação inválido.' });
      }

      const updated = await transactionService.update(userId, id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar transação.';
      return res.status(400).json({ error: message });
    }
  }

  // DELETE /transactions/:id
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({ error: 'Acesso não autorizado.' });
      }

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID da transação inválido.' });
      }

      await transactionService.delete(userId, id);
      return res.status(204).send(); // 204 No Content
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao excluir transação.';
      return res.status(400).json({ error: message });
    }
  }
}
