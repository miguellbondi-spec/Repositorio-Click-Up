import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Files') @ApiBearerAuth() @Controller('files')
export class FilesController {
  constructor(private files: FilesService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.files.findAll(tenantId); }
  @Post() create(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() body: any) { return this.files.create(tenantId, user.id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.files.remove(id); }
}
