import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Reports') @ApiBearerAuth() @Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Get('tasks') getTaskReport(@TenantId() tenantId: string) { return this.reports.getTaskReport(tenantId); }
  @Get('financial') getFinancialReport(@TenantId() tenantId: string) { return this.reports.getFinancialReport(tenantId); }
}
