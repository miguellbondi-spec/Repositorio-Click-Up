import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, tenantId: string) {
    return this.prisma.notification.findMany({ where: { userId, tenantId }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(userId: string, tenantId: string) {
    return this.prisma.notification.updateMany({ where: { userId, tenantId, isRead: false }, data: { isRead: true } });
  }

  async create(data: { tenantId: string; userId: string; title: string; body?: string; type?: string; link?: string }) {
    return this.prisma.notification.create({ data });
  }
}
