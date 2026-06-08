import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.project.findMany({
      where: { tenantId, isArchived: false },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({ where: { id }, include: { tasks: true } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.project.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.project.update({ where: { id }, data: { isArchived: true } });
  }
}
