import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware para verificar o token JWT e injetar o userId na requisição
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // 1. Validação de formato do cabeçalho
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido ou mal formatado.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ error: 'JWT_SECRET não configurado nas variáveis de ambiente.' });
    return;
  }

  try {
    // 2. Validação da assinatura do token
    const decoded = jwt.verify(token, secret);

    // Type Narrowing seguro sem usar "any" ou type assertion forçada
    if (typeof decoded === 'string' || !decoded.sub) {
      res.status(401).json({ error: 'Token inválido: payload ausente.' });
      return;
    }

    // 3. Injeção do userId (o "sub" do JWT) na requisição
    req.userId = decoded.sub;

    return next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
    return;
  }
}
