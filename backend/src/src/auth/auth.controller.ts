import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-auth.dto';
import { CreateUserValidationDto } from './dto/registration-validation.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register A New User',
    description: 'Register A new User!',
  })
  @Post('register')
  @ApiErrorResponse({
    validation: CreateUserValidationDto,
  })
  register(@Body() CreateUserDto: createUserDto) {
    return this.authService.register(CreateUserDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
