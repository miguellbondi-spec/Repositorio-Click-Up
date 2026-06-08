import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.auditLog.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async log(data: { tenantId: string; userId: string; action: string; entityType: string; entityId: string; details?: any; ipAddress?: string }) {
    return this.prisma.auditLog.create({ data });
  }
}
