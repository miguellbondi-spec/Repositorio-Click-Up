import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChannels(tenantId: string) {
    return this.prisma.channel.findMany({ where: { tenantId }, include: { _count: { select: { members: true, messages: true } } } });
  }

  async getMessages(channelId: string, take = 50) {
    return this.prisma.message.findMany({
      where: { channelId },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async createChannel(tenantId: string, data: any) {
    return this.prisma.channel.create({ data: { ...data, tenantId } });
  }

  async sendMessage(channelId: string, authorId: string, content: string) {
    return this.prisma.message.create({
      data: { channelId, authorId, content },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }
}
