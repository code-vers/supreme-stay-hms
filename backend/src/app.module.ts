import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Permission } from './permissions/entities/permission.entity';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { HotelsModule } from './src/hotels/hotels.module';
import { HotelsModule } from './hotels/hotels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
        entities: [User, Role, Permission],
        synchronize: true,
        logging: config.get<string>('DB_LOGGING') === 'true',
        ssl: { rejectUnauthorized: false },
      }),
    }),
    UsersModule,
    AuthModule,
    HotelsModule,
  ],
  controllers: [AppController],
  providers: [AppService,  {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },],
})
export class AppModule {}
