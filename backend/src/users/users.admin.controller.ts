import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user.role.enun';
import { MailService } from 'src/common/mail/mail.service';
import { UserStatus } from 'src/common/enum/user.status.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersAdminController {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  @Get('owner-requests')
  @Roles(UserRole.SUPER_ADMIN)
  async listPendingOwners() {
    const users = await this.usersService.findPendingOwners();
    return { data: users };
  }

  @Post('owner-requests/:id/approve')
  @Roles(UserRole.SUPER_ADMIN)
  async approve(@Param('id') id: string) {
    const user = await this.usersService.update(id, {
      status: UserStatus.ACTIVE,
    });
    if (user) {
      await this.mailService.sendMail(
        user.email,
        'Property Owner Request Accepted',
        '<p>Your property owner request has been accepted. You can now log in to your account.</p>',
      );
    }
    return { message: 'Approved', user };
  }

  @Post('owner-requests/:id/reject')
  @Roles(UserRole.SUPER_ADMIN)
  async reject(@Param('id') id: string, @Body() body: { reason?: string }) {
    const user = await this.usersService.update(id, {
      status: UserStatus.REJECTED,
      rejectionReason: body.reason,
    });
    if (user) {
      await this.mailService.sendMail(
        user.email,
        'Account Rejected',
        `<p>Your registration was rejected. Reason: ${body.reason || 'Not specified'}</p>`,
      );
    }
    return { message: 'Rejected', user };
  }
}
