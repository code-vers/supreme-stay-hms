import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseTransformerInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseTransformerInterceptor());
  app.enableCors();
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap().catch((err) => console.error(err));
