import 'dotenv/config';
import { app } from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
  console.log(`📡 Rota de saúde: http://localhost:${PORT}/health`);
  console.log(`🔐 Rotas de autenticação: http://localhost:${PORT}/auth/register e /auth/login`);
});
