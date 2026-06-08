import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getTaskReport(tenantId: string) {
    const byStatus = await this.prisma.task.groupBy({ by: ['status'], where: { tenantId }, _count: true });
    const byPriority = await this.prisma.task.groupBy({ by: ['priority'], where: { tenantId }, _count: true });
    return { byStatus, byPriority };
  }

  async getFinancialReport(tenantId: string) {
    return this.prisma.financialTransaction.groupBy({
      by: ['type', 'category'],
      where: { tenantId },
      _sum: { amount: true },
      _count: true,
    });
  }
}
