import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersAdminController } from './users.admin.controller';
import { MailModule } from 'src/common/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  providers: [UsersService],
  controllers: [UsersAdminController],
  exports: [UsersService],
})
export class UsersModule {}
