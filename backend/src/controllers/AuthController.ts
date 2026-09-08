import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  // POST /auth/register
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      // Validação estrita de tipo em tempo de execução
      if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
          error: 'Campos inválidos. Forneça name, email e password como textos.',
        });
      }

      if (!name.trim() || !email.trim() || password.length < 6) {
        return res.status(400).json({
          error: 'A senha deve ter no mínimo 6 caracteres e os campos não podem ser vazios.',
        });
      }

      const result = await authService.register({ name, email, password });
      return res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno ao registrar usuário.';
      return res.status(400).json({ error: message });
    }
  }

  // POST /auth/login
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
          error: 'Email e password são obrigatórios e devem ser textos.',
        });
      }

      const result = await authService.login({ email, password });
      return res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno ao autenticar.';
      return res.status(401).json({ error: message });
    }
  }
}
