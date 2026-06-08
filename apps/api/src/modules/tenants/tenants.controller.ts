import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Tenants') @ApiBearerAuth() @Controller('tenants')
export class TenantsController {
  constructor(private tenants: TenantsService) {}

  @Get('current') getCurrent(@TenantId() tenantId: string) { return this.tenants.findOne(tenantId); }
  @Put('current') update(@TenantId() tenantId: string, @Body() body: any) { return this.tenants.update(tenantId, body); }
}
