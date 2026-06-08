import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, projectId?: string) {
    return this.prisma.task.findMany({
      where: { tenantId, ...(projectId ? { projectId } : {}) },
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true } },
        _count: { select: { comments: true, subtasks: true } },
      },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        comments: { include: { author: { select: { id: true, name: true, avatarUrl: true } } } },
        checklists: { include: { items: true } },
        subtasks: true,
        timeEntries: true,
      },
    });
  }

  async create(tenantId: string, creatorId: string, data: any) {
    return this.prisma.task.create({ data: { ...data, tenantId, creatorId } });
  }

  async update(id: string, data: any) {
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
