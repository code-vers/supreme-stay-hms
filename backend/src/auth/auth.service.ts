import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserStatus } from 'src/common/enum/user.status.enum';
import { UserRole } from 'src/common/enum/user.role.enun';
import { MailService } from 'src/common/mail/mail.service';
import { Role } from 'src/roles/entities/role.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { LessThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordResetToken } from './entity/password.reset.token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService,

    private cloudinaryService: CloudinaryService,

    @InjectRepository(PasswordResetToken)
    private tokenRepo: Repository<PasswordResetToken>,
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
  ) {}

  private getStringField(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  // Register property owner (multipart files handled in controller)
  async registerPropertyOwner(
    data: {
      email?: unknown;
      password?: unknown;
      firstName?: unknown;
      lastName?: unknown;
      phoneNumber?: unknown;
      address?: unknown;
      role?: unknown;
      nidNumber?: unknown;
      nidName?: unknown;
      dob?: unknown;
      presentAddress?: unknown;
      permanentAddress?: unknown;
      profession?: unknown;
      companyName?: unknown;
    },
    files: Array<{
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    }>,
  ) {
    const email = this.getStringField(data.email);
    const password = this.getStringField(data.password);
    const firstName = this.getStringField(data.firstName);
    const lastName = this.getStringField(data.lastName);
    const phoneNumber = this.getStringField(data.phoneNumber);
    const address = this.getStringField(data.address);
    const role = this.getStringField(data.role);
    const nidNumber = this.getStringField(data.nidNumber ?? data.nidName);
    const dob = this.getStringField(data.dob);
    const presentAddress = this.getStringField(data.presentAddress);
    const permanentAddress = this.getStringField(data.permanentAddress);
    const profession = this.getStringField(data.profession);
    const companyName = this.getStringField(data.companyName);

    if (!email || !password || !firstName || !lastName || !role) {
      throw new BadRequestException('Missing required registration fields');
    }

    const existing = await this.usersService.findOneByEmail(email);
    if (existing) throw new ConflictException('User already exists');

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        role,
      );

    const selectedRole = await this.rolesRepo.findOne({
      where: isUuid ? { id: role } : { name: role as UserRole },
    });
    if (!selectedRole) throw new BadRequestException('Invalid role');

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadedDocs: { url: string; name?: string; type?: string }[] = [];
    if (files && files.length > 0) {
      for (const f of files) {
        const res = await this.cloudinaryService.uploadBuffer(f.buffer);
        uploadedDocs.push({
          url: res.url,
          name: f.originalname,
          type: f.mimetype,
        });
      }
    }

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: selectedRole,
      phoneNumber,
      address,
      nidNumber,
      dob: dob ? new Date(dob) : undefined,
      presentAddress,
      permanentAddress,
      profession,
      companyName,
      documents: uploadedDocs,
      status: UserStatus.PENDING,
    });

    const superAdmins = await this.usersService.findUsersByRole(
      UserRole.SUPER_ADMIN,
    );
    const adminEmails: string[] = [];
    for (const admin of superAdmins as Array<{ email?: unknown }>) {
      const adminEmail = this.getStringField(admin.email);
      if (adminEmail) {
        adminEmails.push(adminEmail);
      }
    }

    const adminHtml = `<p>New property owner registration request from ${user.email}.</p>`;
    const ownerHtml = `<p>Your property owner request has been submitted successfully. Our team will review it and notify you once it has been approved.</p>`;

    if (adminEmails.length > 0) {
      await this.mailService.sendMail(
        adminEmails,
        'New Property Owner Request',
        adminHtml,
      );
    }

    await this.mailService.sendMail(
      user.email,
      'Property Owner Request Submitted',
      ownerHtml,
    );

    return { message: 'Property owner registration submitted for review' };
  }

  // Registration
  async register(registerDto: RegisterDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phoneNumber,
      address,
      imageUrl,
    } = registerDto;

    const existing = await this.usersService.findOneByEmail(email);
    if (existing) throw new ConflictException('User already exists');

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        role,
      );

    const selectedRole = await this.rolesRepo.findOne({
      where: isUuid ? { id: role } : { name: role as UserRole },
    });
    if (!selectedRole) {
      throw new BadRequestException('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: selectedRole,
      phoneNumber,
      address,
      imageUrl,
    });

    return { message: 'User registered successfully', userId: user.id };
  }

  // Login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If property owner, ensure approved
    const roleName = user.role?.name;
    if (roleName === UserRole.PROPERTY_OWNER) {
      if (user.status === UserStatus.PENDING) {
        throw new UnauthorizedException(
          'Your account is under review. You will be notified once approved.',
        );
      }
      if (user.status === UserStatus.REJECTED) {
        throw new UnauthorizedException(
          `Your registration was rejected. Reason: ${user.rejectionReason || 'No reason provided'}`,
        );
      }
    }

    const tokens = await this.generateTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  // Refresh
  async refresh(refreshToken: string) {
    const user = await this.usersService.findOneByRefreshToken(refreshToken);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    try {
      this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      await this.usersService.updateRefreshToken(user.id, null);
      throw new UnauthorizedException('Refresh token expired');
    }

    const tokens = await this.generateTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  // Logout
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  // Profile
  async getProfile(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new UnauthorizedException();
    const { ...profile } = user;
    return profile;
  }

  // Token generator
  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.role?.id ?? null,
      roleName: user.role?.name ?? null,
      role: user.role?.name ?? null, // backward compatibility
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: 60 * 60 * 24,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return { access_token, refresh_token };
  }

  //get public role

  async getUserRole() {
    const roles = await this.rolesRepo.find();
    return roles;
  }

  //  FORGOT PASSWORD

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return { message: 'If account exists, reset link sent' };
    }

    // old token invalidate TODO:enable must be
    // await this.tokenRepo.update(
    //   { userId: user.id, used: false },
    //   { used: true },
    // );

    const rawToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const tokenEntity = this.tokenRepo.create({
      userId: user.id,
      token: hashedToken,
      expiresAt,
      used: false,
    });

    await this.tokenRepo.save(tokenEntity);

    const resetLink = `http://localhost:3000/reset-password?token=${rawToken}`;

    await this.mailService.sendResetPasswordEmail(user.email, resetLink);

    return { message: 'If account exists, reset link sent' };
  }

  //  RESET PASSWORD

  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenEntry = await this.tokenRepo.findOne({
      where: {
        token: hashedToken,
        used: false,
      },
    });

    if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.usersService.findOneById(tokenEntry.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.update(user.id, {
      password: hashedPassword,
    });

    await this.tokenRepo.update(tokenEntry.id, {
      used: true,
    });

    return { message: 'Password reset successful' };
  }

  // MAIL (TEMP)

  // private async sendMail(email: string, resetLink: string) {
  //   console.log(`Send mail to ${email}: ${resetLink}`);
  // }

  //  CLEANUP

  async deleteExpiredTokens() {
    await this.tokenRepo.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
