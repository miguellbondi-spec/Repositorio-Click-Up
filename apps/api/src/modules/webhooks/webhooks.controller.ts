import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Webhooks') @ApiBearerAuth() @Controller('webhooks')
export class WebhooksController {
  constructor(private webhooks: WebhooksService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.webhooks.findAll(tenantId); }
  @Post() create(@TenantId() tenantId: string, @Body() body: any) { return this.webhooks.create(tenantId, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.webhooks.remove(id); }
}
