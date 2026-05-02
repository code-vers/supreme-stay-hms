import { ApiProperty } from '@nestjs/swagger';
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from 'src/common/dto/validation-error.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class CreateUserValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: 'Create user validation failed' })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: 'api/users/create' })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: 'email', message: 'Email must be a valid email address' },
      { field: 'first_name', message: 'First name is required' },
      { field: 'last_name', message: 'Last name is required' },
      {
        field: 'password',
        message: 'Password must be at least 6 characters long',
      },
      { field: 'image', message: 'Image must be a string' },
      { field: 'address', message: 'Address is required' },
      { field: 'phone', message: 'Phone number is required' },
      { field: 'status', message: 'Status must be a valid enum value' },
      { field: 'role_id', message: 'Role ID must be a valid MongoDB ObjectId' },
    ],
  })
  declare errors: FieldErrorDto[];
}
