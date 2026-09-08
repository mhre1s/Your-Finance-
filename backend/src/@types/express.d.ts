// Extensão de tipos do Express (Declaration Merging)
// Permite que req.userId exista com tipagem estrita em middlewares e controllers
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
