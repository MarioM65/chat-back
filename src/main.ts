import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: JSON.parse(process.env.ALLOWED_ORIGINS || '[]'),
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH','OPTIONS'],
    allowedHeaders:['content-Type', 'Authorization'],
    credentials:true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
