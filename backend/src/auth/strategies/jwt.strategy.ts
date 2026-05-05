import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/common/enum/user.role.enun';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'fallback-secret',
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    role?: UserRole | null;
    roleId?: string | null;
    roleName?: UserRole | null;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      roleId: payload.roleId ?? null,
      roleName: payload.roleName ?? payload.role ?? null,
    };
  }
}
