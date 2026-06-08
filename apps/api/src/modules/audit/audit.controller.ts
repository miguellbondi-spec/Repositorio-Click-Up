import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Audit') @ApiBearerAuth() @Controller('audit')
export class AuditController {
  constructor(private audit: AuditService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.audit.findAll(tenantId); }
}
