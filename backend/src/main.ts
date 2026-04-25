import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseTransformerInterceptor } from './common/interceptor/response.interceptor';
import { setupSwagger } from './swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseTransformerInterceptor());
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
