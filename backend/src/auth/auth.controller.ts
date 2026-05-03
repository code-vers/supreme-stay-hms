import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Registration endpoint - accepts email, password, firstName, lastName
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
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
  logout(@Req() req: any) {
    return this.authService.logout((req.user?.userId ?? '') as string);
  }

  // Get profile endpoint - returns user profile, protected by JWT auth guard
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return this.authService.getProfile((req.user?.userId ?? '') as string);
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
