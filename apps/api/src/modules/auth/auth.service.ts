import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { addDays } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const slug = dto.companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

    const tenant = await this.prisma.tenant.create({ data: { name: dto.companyName, slug } });
    const user = await this.prisma.user.create({ data: { name: dto.name, email: dto.email, password: hashed } });
    await this.prisma.tenantUser.create({ data: { tenantId: tenant.id, userId: user.id, role: 'ADMIN' } });

    return this.generateTokens(user.id, tenant.id, 'ADMIN');
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tenantUser = await this.prisma.tenantUser.findFirst({ where: { userId: user.id } });
    if (!tenantUser) throw new UnauthorizedException('No tenant found');

    return this.generateTokens(user.id, tenantUser.tenantId, tenantUser.role);
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    const tenantUser = await this.prisma.tenantUser.findFirst({ where: { userId: user.id } });

    await this.prisma.refreshToken.delete({ where: { token } });
    return this.generateTokens(user.id, tenantUser.tenantId, tenantUser.role);
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, tenantId: string, role: string) {
    const payload = { sub: userId, tenantId, role };
    const accessToken = this.jwt.sign(payload, { expiresIn: this.config.get('JWT_EXPIRES_IN', '15m') });
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET', 'refresh-secret'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt: addDays(new Date(), 7) },
    });

    return { accessToken, refreshToken, tenantId };
  }
}
