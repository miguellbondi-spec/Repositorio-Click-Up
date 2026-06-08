import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CRM') @ApiBearerAuth() @Controller('crm')
export class CrmController {
  constructor(private crm: CrmService) {}

  @Get('leads') getLeads(@TenantId() tenantId: string) { return this.crm.getLeads(tenantId); }
  @Post('leads') createLead(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() body: any) { return this.crm.createLead(tenantId, user.id, body); }
  @Put('leads/:id') updateLead(@Param('id') id: string, @Body() body: any) { return this.crm.updateLead(id, body); }

  @Get('deals') getDeals(@TenantId() tenantId: string) { return this.crm.getDeals(tenantId); }
  @Post('deals') createDeal(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() body: any) { return this.crm.createDeal(tenantId, user.id, body); }
  @Put('deals/:id') updateDeal(@Param('id') id: string, @Body() body: any) { return this.crm.updateDeal(id, body); }
}
