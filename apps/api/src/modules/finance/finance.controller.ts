import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Finance') @ApiBearerAuth() @Controller('finance')
export class FinanceController {
  constructor(private finance: FinanceService) {}

  @Get('transactions') getTransactions(@TenantId() tenantId: string) { return this.finance.getTransactions(tenantId); }
  @Get('summary') getSummary(@TenantId() tenantId: string) { return this.finance.getSummary(tenantId); }
  @Post('transactions') create(@TenantId() tenantId: string, @Body() body: any) { return this.finance.create(tenantId, body); }
}
