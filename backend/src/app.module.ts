import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { dataSourceOptions } from './config/typeorm.config';
import { AuthModule } from './src/auth/auth.module';
import { UsersModule } from './src/users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
