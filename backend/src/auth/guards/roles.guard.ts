import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common/enum/user.role.enun';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true; // no @Roles() = any authenticated user

    const { user } = context.switchToHttp().getRequest();
    const userRoleName = (user?.roleName ?? user?.role?.name ?? user?.role) as
      | UserRole
      | undefined;

    if (!userRoleName) return false;
    return requiredRoles.includes(userRoleName);
  }
}
