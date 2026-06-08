import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  async getEmployees(tenantId: string) {
    return this.prisma.employee.findMany({ where: { tenantId }, include: { department: true }, orderBy: { name: 'asc' } });
  }

  async getDepartments(tenantId: string) {
    return this.prisma.department.findMany({ where: { tenantId }, include: { _count: { select: { employees: true } } } });
  }

  async createEmployee(tenantId: string, data: any) {
    return this.prisma.employee.create({ data: { ...data, tenantId } });
  }

  async updateEmployee(id: string, data: any) {
    return this.prisma.employee.update({ where: { id }, data });
  }

  async createDepartment(tenantId: string, data: any) {
    return this.prisma.department.create({ data: { ...data, tenantId } });
  }
}
