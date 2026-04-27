import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserStatus } from 'src/common/enum/user.enum';

export class CreateAuthDto {}

export class createUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  image!: string;

  @IsString()
  address!: string;

  @IsString()
  phone!: string;

  @IsString()
  status!: UserStatus;

  @IsString()
  role_id!: string;
}
