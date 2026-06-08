import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TimeTrackingService {
  constructor(private prisma: PrismaService) {}

  async findByTask(taskId: string) {
    return this.prisma.timeEntry.findMany({ where: { taskId }, include: { user: { select: { id: true, name: true } } } });
  }

  async start(taskId: string, userId: string, description?: string) {
    return this.prisma.timeEntry.create({ data: { taskId, userId, description, startTime: new Date() } });
  }

  async stop(id: string) {
    const entry = await this.prisma.timeEntry.findUnique({ where: { id } });
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / 1000);
    return this.prisma.timeEntry.update({ where: { id }, data: { endTime, duration } });
  }
}
