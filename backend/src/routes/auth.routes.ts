import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export const authRoutes = Router();
const authController = new AuthController();

// Rotas públicas de autenticação
authRoutes.post('/register', (req, res) => {
  authController.register(req, res);
});

authRoutes.post('/login', (req, res) => {
  authController.login(req, res);
});
