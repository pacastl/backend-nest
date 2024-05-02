import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Congiguracion global de los pipes 
  app.useGlobalPipes(
    new ValidationPipe({
      // Tiene que mandarme la info como yo quiero o NO la acepto
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );
   
  await app.listen(3000);
}
bootstrap();
