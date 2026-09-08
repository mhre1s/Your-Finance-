import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
  await app.listen(port);
  console.log(`🚀 NestJS rodando em http://localhost:${port}`);
  console.log(`🔐 Endpoints de Auth: http://localhost:${port}/auth/register e /auth/login`);
}
await bootstrap();
