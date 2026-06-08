import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async getLeads(tenantId: string) {
    return this.prisma.lead.findMany({ where: { tenantId }, include: { owner: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async createLead(tenantId: string, ownerId: string, data: any) {
    return this.prisma.lead.create({ data: { ...data, tenantId, ownerId } });
  }

  async updateLead(id: string, data: any) {
    return this.prisma.lead.update({ where: { id }, data });
  }

  async getDeals(tenantId: string) {
    return this.prisma.deal.findMany({ where: { tenantId }, include: { owner: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async createDeal(tenantId: string, ownerId: string, data: any) {
    return this.prisma.deal.create({ data: { ...data, tenantId, ownerId } });
  }

  async updateDeal(id: string, data: any) {
    return this.prisma.deal.update({ where: { id }, data });
  }
}
