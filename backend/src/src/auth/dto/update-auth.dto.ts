import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/src/users/dto/create-user.dto';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
export class updateUserDto extends PartialType(CreateUserDto) {}
