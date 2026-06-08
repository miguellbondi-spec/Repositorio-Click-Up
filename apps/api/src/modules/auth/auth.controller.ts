import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public() @Post('register')
  register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

  @Public() @Post('login') @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Public() @Post('refresh') @HttpCode(HttpStatus.OK)
  refresh(@Body('refreshToken') token: string) { return this.auth.refresh(token); }

  @Post('logout') @HttpCode(HttpStatus.OK)
  logout(@Body('refreshToken') token: string) { return this.auth.logout(token); }
}
