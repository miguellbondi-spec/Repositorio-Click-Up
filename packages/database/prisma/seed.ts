import { PrismaClient, Role, TaskStatus, Priority, LeadStatus, DealStatus, TransactionType, AutomationTrigger } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const gestorPassword = await bcrypt.hash('Gestor@123', 10);
  const collabPassword = await bcrypt.hash('Collab@123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@zacxorg.com' },
    update: {},
    create: {
      email: 'admin@zacxorg.com',
      password: adminPassword,
      name: 'Super Admin',
    },
  });

  const gestorUser = await prisma.user.upsert({
    where: { email: 'gestor@empresa-demo.com' },
    update: {},
    create: {
      email: 'gestor@empresa-demo.com',
      password: gestorPassword,
      name: 'Gestor Demo',
    },
  });

  const collabUser = await prisma.user.upsert({
    where: { email: 'ana@empresa-demo.com' },
    update: {},
    create: {
      email: 'ana@empresa-demo.com',
      password: collabPassword,
      name: 'Ana Colaboradora',
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'empresa-demo' },
    update: {},
    create: {
      name: 'Empresa Demo',
      slug: 'empresa-demo',
      plan: 'professional',
    },
  });

  await prisma.tenantUser.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: adminUser.id } },
    update: {},
    create: { tenantId: tenant.id, userId: adminUser.id, role: Role.SUPER_ADMIN },
  });

  await prisma.tenantUser.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: gestorUser.id } },
    update: {},
    create: { tenantId: tenant.id, userId: gestorUser.id, role: Role.MANAGER },
  });

  await prisma.tenantUser.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: collabUser.id } },
    update: {},
    create: { tenantId: tenant.id, userId: collabUser.id, role: Role.COLLABORATOR },
  });

  const project = await prisma.project.create({
    data: {
      tenantId: tenant.id,
      name: 'Projeto Principal',
      description: 'Projeto de demonstração do sistema',
      color: '#6366f1',
    },
  });

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        tenantId: tenant.id,
        projectId: project.id,
        title: 'Configurar ambiente de desenvolvimento',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        creatorId: adminUser.id,
        assigneeId: gestorUser.id,
      },
    }),
    prisma.task.create({
      data: {
        tenantId: tenant.id,
        projectId: project.id,
        title: 'Implementar autenticação JWT',
        status: TaskStatus.DONE,
        priority: Priority.URGENT,
        creatorId: adminUser.id,
        assigneeId: adminUser.id,
      },
    }),
    prisma.task.create({
      data: {
        tenantId: tenant.id,
        projectId: project.id,
        title: 'Criar dashboard principal',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        creatorId: gestorUser.id,
        assigneeId: collabUser.id,
      },
    }),
    prisma.task.create({
      data: {
        tenantId: tenant.id,
        projectId: project.id,
        title: 'Integração com CRM',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        creatorId: gestorUser.id,
      },
    }),
    prisma.task.create({
      data: {
        tenantId: tenant.id,
        projectId: project.id,
        title: 'Testes de usabilidade',
        status: TaskStatus.BACKLOG,
        priority: Priority.LOW,
        creatorId: adminUser.id,
      },
    }),
  ]);

  const channel = await prisma.channel.create({
    data: {
      tenantId: tenant.id,
      name: 'geral',
      description: 'Canal geral da empresa',
    },
  });

  await prisma.channelMember.createMany({
    data: [
      { channelId: channel.id, userId: adminUser.id },
      { channelId: channel.id, userId: gestorUser.id },
      { channelId: channel.id, userId: collabUser.id },
    ],
  });

  await prisma.message.createMany({
    data: [
      { channelId: channel.id, authorId: adminUser.id, content: 'Bem-vindos ao ZacxOrg! 🚀' },
      { channelId: channel.id, authorId: gestorUser.id, content: 'Sistema incrível! Muito obrigado.' },
      { channelId: channel.id, authorId: collabUser.id, content: 'Amei a interface, ficou muito boa!' },
    ],
  });

  await prisma.lead.createMany({
    data: [
      { tenantId: tenant.id, ownerId: gestorUser.id, name: 'João Silva', email: 'joao@empresa.com', company: 'Tech Corp', status: LeadStatus.QUALIFIED, value: 15000 },
      { tenantId: tenant.id, ownerId: gestorUser.id, name: 'Maria Santos', email: 'maria@startup.io', company: 'Startup IO', status: LeadStatus.PROPOSAL, value: 8500 },
      { tenantId: tenant.id, ownerId: collabUser.id, name: 'Pedro Costa', email: 'pedro@industria.com', company: 'Indústria XYZ', status: LeadStatus.NEW, value: 25000 },
    ],
  });

  await prisma.oKR.createMany({
    data: [
      {
        tenantId: tenant.id,
        ownerId: adminUser.id,
        title: 'Aumentar receita em 30%',
        quarter: 'Q2',
        year: 2025,
        progress: 45,
        keyResults: [
          { title: 'Fechar 10 novos contratos', progress: 60 },
          { title: 'Aumentar ticket médio em R$5k', progress: 30 },
        ],
      },
      {
        tenantId: tenant.id,
        ownerId: gestorUser.id,
        title: 'Lançar 3 novos produtos',
        quarter: 'Q2',
        year: 2025,
        progress: 33,
        keyResults: [
          { title: 'MVP do produto A', progress: 80 },
          { title: 'MVP do produto B', progress: 20 },
          { title: 'MVP do produto C', progress: 0 },
        ],
      },
    ],
  });

  await prisma.financialTransaction.createMany({
    data: [
      { tenantId: tenant.id, type: TransactionType.INCOME, category: 'Vendas', description: 'Contrato cliente A', amount: 15000, date: new Date('2025-01-15') },
      { tenantId: tenant.id, type: TransactionType.INCOME, category: 'Serviços', description: 'Consultoria mensal', amount: 8000, date: new Date('2025-02-01') },
      { tenantId: tenant.id, type: TransactionType.EXPENSE, category: 'Infraestrutura', description: 'Servidores AWS', amount: 2500, date: new Date('2025-02-05') },
      { tenantId: tenant.id, type: TransactionType.EXPENSE, category: 'Marketing', description: 'Campanhas Google Ads', amount: 3000, date: new Date('2025-02-10') },
      { tenantId: tenant.id, type: TransactionType.INCOME, category: 'Vendas', description: 'Contrato cliente B', amount: 22000, date: new Date('2025-03-01') },
    ],
  });

  await prisma.automation.create({
    data: {
      tenantId: tenant.id,
      name: 'Notificar na criação de tarefa',
      trigger: AutomationTrigger.TASK_CREATED,
      actions: [{ type: 'notify', config: { message: 'Nova tarefa criada!' } }],
      isActive: true,
    },
  });

  const department = await prisma.department.create({
    data: { tenantId: tenant.id, name: 'Tecnologia' },
  });

  await prisma.employee.createMany({
    data: [
      { tenantId: tenant.id, departmentId: department.id, name: 'Carlos Dev', email: 'carlos@empresa-demo.com', position: 'Desenvolvedor Senior', salary: 8000 },
      { tenantId: tenant.id, departmentId: department.id, name: 'Lucia Designer', email: 'lucia@empresa-demo.com', position: 'UX Designer', salary: 6500 },
    ],
  });

  console.log('Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
