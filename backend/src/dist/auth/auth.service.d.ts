import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from "../common/mail/mail.service";
import { Role } from "../roles/entities/role.entity";
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordResetToken } from './entity/password.reset.token.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private config;
    private mailService;
    private tokenRepo;
    private rolesRepo;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigService, mailService: MailService, tokenRepo: Repository<PasswordResetToken>, rolesRepo: Repository<Role>);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: Role;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: Role;
        status: boolean;
        imageUrl?: string;
        phoneNumber?: string;
        address?: string;
        refreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateTokens;
    getUserRole(): Promise<Role[]>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
    deleteExpiredTokens(): Promise<void>;
}
