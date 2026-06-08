import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Dashboard') @ApiBearerAuth() @Controller('dashboard')
export class DashboardController {
  constructor(private dashboard: DashboardService) {}

  @Get('stats') getStats(@TenantId() tenantId: string) { return this.dashboard.getStats(tenantId); }
}
