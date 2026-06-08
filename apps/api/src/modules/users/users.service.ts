import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.tenantUser.findMany({
      where: { tenantId },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true, isActive: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, avatarUrl: true, isActive: true, createdAt: true } });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
