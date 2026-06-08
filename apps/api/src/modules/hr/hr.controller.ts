import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('HR') @ApiBearerAuth() @Controller('hr')
export class HrController {
  constructor(private hr: HrService) {}

  @Get('employees') getEmployees(@TenantId() tenantId: string) { return this.hr.getEmployees(tenantId); }
  @Get('departments') getDepartments(@TenantId() tenantId: string) { return this.hr.getDepartments(tenantId); }
  @Post('employees') createEmployee(@TenantId() tenantId: string, @Body() body: any) { return this.hr.createEmployee(tenantId, body); }
  @Put('employees/:id') updateEmployee(@Param('id') id: string, @Body() body: any) { return this.hr.updateEmployee(id, body); }
  @Post('departments') createDepartment(@TenantId() tenantId: string, @Body() body: any) { return this.hr.createDepartment(tenantId, body); }
}
