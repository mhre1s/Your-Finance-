// Extensão de tipos do Express para o NestJS
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
