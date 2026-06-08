import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.document.findMany({ where: { tenantId }, orderBy: { updatedAt: 'desc' } });
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({ where: { id }, include: { versions: { orderBy: { version: 'desc' } } } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.document.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any, userId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (data.content && doc.content !== data.content) {
      const count = await this.prisma.documentVersion.count({ where: { documentId: id } });
      await this.prisma.documentVersion.create({ data: { documentId: id, content: doc.content || '', version: count + 1, createdBy: userId } });
    }
    return this.prisma.document.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.document.delete({ where: { id } });
  }
}
