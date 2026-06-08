import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.webhook.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.webhook.create({ data: { ...data, tenantId } });
  }

  async remove(id: string) {
    return this.prisma.webhook.delete({ where: { id } });
  }
}
