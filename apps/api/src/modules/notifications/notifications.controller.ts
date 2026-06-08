import { Controller, Get, Put, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Notifications') @ApiBearerAuth() @Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get() findAll(@CurrentUser() user: any, @TenantId() tenantId: string) { return this.notifications.findAll(user.id, tenantId); }
  @Put(':id/read') markRead(@Param('id') id: string) { return this.notifications.markRead(id); }
  @Put('read-all') markAllRead(@CurrentUser() user: any, @TenantId() tenantId: string) { return this.notifications.markAllRead(user.id, tenantId); }
}
