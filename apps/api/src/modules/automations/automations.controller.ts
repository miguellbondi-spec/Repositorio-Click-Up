import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Automations') @ApiBearerAuth() @Controller('automations')
export class AutomationsController {
  constructor(private automations: AutomationsService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.automations.findAll(tenantId); }
  @Post() create(@TenantId() tenantId: string, @Body() body: any) { return this.automations.create(tenantId, body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.automations.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.automations.remove(id); }
}
