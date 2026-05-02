import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from 'src/common/enum/user.enum';

export class RegistrationSuccessDto {
  @ApiProperty({ example: 'Successfully registered user!' })
  message!: string;

  @ApiProperty({ example: 201 })
  statusCode!: number;

  @ApiProperty({
    example: {
      id: '8a7c61b0-3e97-4c33-a5d6-b8516f8b32cd',
      email: 'john@example.com',
      first_name: 'John',
      last_name: 'Doe',
      image: 'https://example.com/image.jpg',
      address: 'Dhaka, Bangladesh',
      phone: '01912345678',
      status: UserStatus.ACTIVE,
      role_id: 'cdb1e01f-37f8-4d9b-a9d4-b2f641f1cb91',
    },
  })
  data!: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    image: string;
    address: string;
    phone: string;
    status: UserStatus;
    role_id: string;
  };
}
