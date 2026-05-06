import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Registration endpoint - accepts email, password, firstName, lastName
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('register-owner')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'documents', maxCount: 5 }], {
      storage: multer.memoryStorage(),
    }),
  )
  registerOwner(
    @Body() body: any,
    @UploadedFiles() files: { documents?: any[] },
  ) {
    const docs = files?.documents || [];
    return this.authService.registerPropertyOwner(body, docs);
  }

  // Login endpoint - accepts email and password, returns access and refresh tokens
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Refresh token endpoint - accepts refresh token, returns new access and refresh tokens
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  // Logout endpoint - invalidates refresh token
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser('userId') userId: string) {
    return this.authService.logout(userId ?? '');
  }

  // Get profile endpoint - returns user profile, protected by JWT auth guard
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser('userId') userId: string) {
    return this.authService.getProfile(userId ?? '');
  }

  //get user role

  @Get('roles')
  getUserRoles() {
    return this.authService.getUserRole();
  }

  //  FORGOT PASSWORD
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  //  RESET PASSWORD
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }
}
