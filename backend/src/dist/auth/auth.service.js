"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const mail_service_1 = require("../common/mail/mail.service");
const role_entity_1 = require("../roles/entities/role.entity");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const password_reset_token_entity_1 = require("./entity/password.reset.token.entity");
let AuthService = class AuthService {
    usersService;
    jwtService;
    config;
    mailService;
    tokenRepo;
    rolesRepo;
    constructor(usersService, jwtService, config, mailService, tokenRepo, rolesRepo) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
        this.mailService = mailService;
        this.tokenRepo = tokenRepo;
        this.rolesRepo = rolesRepo;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, role, phoneNumber, address, imageUrl, } = registerDto;
        const existing = await this.usersService.findOneByEmail(email);
        if (existing)
            throw new common_1.ConflictException('User already exists');
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(role);
        const selectedRole = await this.rolesRepo.findOne({
            where: isUuid ? { id: role } : { name: role },
        });
        if (!selectedRole) {
            throw new common_1.BadRequestException('Invalid role');
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
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usersService.findOneByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async refresh(refreshToken) {
        const user = await this.usersService.findOneByRefreshToken(refreshToken);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            await this.usersService.updateRefreshToken(user.id, null);
            throw new common_1.UnauthorizedException('Refresh token expired');
        }
        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async logout(userId) {
        await this.usersService.updateRefreshToken(userId, null);
        return { message: 'Logged out successfully' };
    }
    async getProfile(userId) {
        const user = await this.usersService.findOneById(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        const { ...profile } = user;
        return profile;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            roleId: user.role?.id ?? null,
            roleName: user.role?.name ?? null,
            role: user.role?.name ?? null,
        };
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: 60 * 60 * 24,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: 60 * 60 * 24 * 7,
            }),
        ]);
        return { access_token, refresh_token };
    }
    async getUserRole() {
        const roles = await this.rolesRepo.find();
        return roles;
    }
    async forgotPassword(email) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return { message: 'If account exists, reset link sent' };
        }
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
    async resetPassword(token, password) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const tokenEntry = await this.tokenRepo.findOne({
            where: {
                token: hashedToken,
                used: false,
            },
        });
        if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const user = await this.usersService.findOneById(tokenEntry.userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
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
    async deleteExpiredTokens() {
        await this.tokenRepo.delete({
            expiresAt: (0, typeorm_2.LessThan)(new Date()),
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetToken)),
    __param(5, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map