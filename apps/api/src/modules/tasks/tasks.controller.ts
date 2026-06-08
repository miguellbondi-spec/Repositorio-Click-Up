import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tasks') @ApiBearerAuth() @Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get() findAll(@TenantId() tenantId: string, @Query('projectId') projectId?: string) { return this.tasks.findAll(tenantId, projectId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.tasks.findOne(id); }
  @Post() create(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() body: any) { return this.tasks.create(tenantId, user.id, body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.tasks.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.tasks.remove(id); }
}
