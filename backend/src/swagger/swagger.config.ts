import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API Documentation')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token',
  )
  .setContact(
    'Rakib Dev Team',
    'https://your-website.com',
    'support@yourmail.com',
  )
  .build();
