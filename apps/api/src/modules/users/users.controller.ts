import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users') @ApiBearerAuth() @Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get() findAll(@TenantId() tenantId: string) { return this.users.findAll(tenantId); }
  @Get('me') getMe(@CurrentUser() user: any) { return this.users.findOne(user.id); }
  @Get(':id') findOne(@Param('id') id: string) { return this.users.findOne(id); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.users.update(id, body); }
}
