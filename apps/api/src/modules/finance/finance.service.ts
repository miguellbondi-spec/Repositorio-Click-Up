import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getTransactions(tenantId: string) {
    return this.prisma.financialTransaction.findMany({ where: { tenantId }, orderBy: { date: 'desc' } });
  }

  async getSummary(tenantId: string) {
    const transactions = await this.prisma.financialTransaction.findMany({ where: { tenantId } });
    const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses, transactions: transactions.length };
  }

  async create(tenantId: string, data: any) {
    return this.prisma.financialTransaction.create({ data: { ...data, tenantId } });
  }
}
