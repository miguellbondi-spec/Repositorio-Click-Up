import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const [projects, tasks, leads, employees, income, expense] = await Promise.all([
      this.prisma.project.count({ where: { tenantId, isArchived: false } }),
      this.prisma.task.count({ where: { tenantId } }),
      this.prisma.lead.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId } }),
      this.prisma.financialTransaction.aggregate({ where: { tenantId, type: 'INCOME' }, _sum: { amount: true } }),
      this.prisma.financialTransaction.aggregate({ where: { tenantId, type: 'EXPENSE' }, _sum: { amount: true } }),
    ]);

    const tasksByStatus = await this.prisma.task.groupBy({ by: ['status'], where: { tenantId }, _count: true });

    return {
      projects,
      tasks,
      leads,
      employees,
      revenue: (income._sum.amount || 0) - (expense._sum.amount || 0),
      tasksByStatus: tasksByStatus.map(t => ({ status: t.status, count: t._count })),
    };
  }
}
