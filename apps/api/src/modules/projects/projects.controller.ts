import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Projects') @ApiBearerAuth() @Controller('projects')
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.projects.findAll(tenantId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.projects.findOne(id); }
  @Post() create(@TenantId() tenantId: string, @Body() body: any) { return this.projects.create(tenantId, body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.projects.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.projects.remove(id); }
}
