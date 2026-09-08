import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Configuração do Swagger OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Your Finances API')
    .setDescription('API de controle financeiro pessoal desenvolvida com NestJS 12, Prisma 6 e PostgreSQL')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT retornado no login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
  await app.listen(port);
  console.log(`🚀 NestJS rodando em http://localhost:${port}`);
  console.log(`📚 Documentação Swagger disponível em: http://localhost:${port}/api`);
  console.log(`🔐 Endpoints de Auth: http://localhost:${port}/auth/register e /auth/login`);
}
await bootstrap();
