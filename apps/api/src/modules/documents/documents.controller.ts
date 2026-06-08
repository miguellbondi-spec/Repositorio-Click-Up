import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Documents') @ApiBearerAuth() @Controller('documents')
export class DocumentsController {
  constructor(private documents: DocumentsService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.documents.findAll(tenantId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.documents.findOne(id); }
  @Post() create(@TenantId() tenantId: string, @Body() body: any) { return this.documents.create(tenantId, body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) { return this.documents.update(id, body, user.id); }
  @Delete(':id') remove(@Param('id') id: string) { return this.documents.remove(id); }
}
