import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OkrService } from './okr.service';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('OKR') @ApiBearerAuth() @Controller('okr')
export class OkrController {
  constructor(private okr: OkrService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.okr.findAll(tenantId); }
  @Post() create(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() body: any) { return this.okr.create(tenantId, user.id, body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.okr.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.okr.remove(id); }
}
