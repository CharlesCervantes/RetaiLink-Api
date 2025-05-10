import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Permitir cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permitir todos los métodos
    allowedHeaders: '*', // Permitir todos los encabezados
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();