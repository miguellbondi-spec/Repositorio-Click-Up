import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AutomationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.automation.findMany({ where: { tenantId }, include: { _count: { select: { logs: true } } } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.automation.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.automation.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.automation.delete({ where: { id } });
  }
}
