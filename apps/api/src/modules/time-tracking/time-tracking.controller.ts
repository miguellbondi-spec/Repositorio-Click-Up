import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TimeTrackingService } from './time-tracking.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('TimeTracking') @ApiBearerAuth() @Controller('time-tracking')
export class TimeTrackingController {
  constructor(private time: TimeTrackingService) {}

  @Get('task/:taskId') findByTask(@Param('taskId') taskId: string) { return this.time.findByTask(taskId); }
  @Post('start') start(@CurrentUser() user: any, @Body() body: any) { return this.time.start(body.taskId, user.id, body.description); }
  @Put(':id/stop') stop(@Param('id') id: string) { return this.time.stop(id); }
}
