import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.file.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async create(tenantId: string, uploadedBy: string, data: any) {
    return this.prisma.file.create({ data: { ...data, tenantId, uploadedBy } });
  }

  async remove(id: string) {
    return this.prisma.file.delete({ where: { id } });
  }
}
