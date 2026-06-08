import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OkrService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.oKR.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async create(tenantId: string, ownerId: string, data: any) {
    return this.prisma.oKR.create({ data: { ...data, tenantId, ownerId } });
  }

  async update(id: string, data: any) {
    return this.prisma.oKR.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.oKR.delete({ where: { id } });
  }
}
