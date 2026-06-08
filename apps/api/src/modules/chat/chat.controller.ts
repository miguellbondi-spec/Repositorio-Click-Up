import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat') @ApiBearerAuth() @Controller('chat')
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get('channels') getChannels(@TenantId() tenantId: string) { return this.chat.getChannels(tenantId); }
  @Post('channels') createChannel(@TenantId() tenantId: string, @Body() body: any) { return this.chat.createChannel(tenantId, body); }
  @Get('channels/:id/messages') getMessages(@Param('id') id: string, @Query('take') take?: string) { return this.chat.getMessages(id, take ? Number(take) : 50); }
  @Post('channels/:id/messages') sendMessage(@Param('id') channelId: string, @CurrentUser() user: any, @Body('content') content: string) { return this.chat.sendMessage(channelId, user.id, content); }
}
