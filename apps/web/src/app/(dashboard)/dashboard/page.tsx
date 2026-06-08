'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { FolderKanban, CheckSquare, Users, TrendingUp, DollarSign, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const monthlyData = [
  { month: 'Jan', receita: 45000, despesas: 28000 },
  { month: 'Fev', receita: 52000, despesas: 31000 },
  { month: 'Mar', receita: 61000, despesas: 34000 },
  { month: 'Abr', receita: 48000, despesas: 29000 },
  { month: 'Mai', receita: 72000, despesas: 38000 },
  { month: 'Jun', receita: 85000, despesas: 42000 },
];

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats'),
  });

  const taskData = (stats as any)?.tasksByStatus?.map((t: any) => ({
    name: t.status, value: t.count,
  })) || [];

  const cards = [
    { label: 'Projetos Ativos', value: (stats as any)?.projects || 0, icon: FolderKanban, color: 'bg-indigo-500' },
    { label: 'Total de Tarefas', value: (stats as any)?.tasks || 0, icon: CheckSquare, color: 'bg-green-500' },
    { label: 'Leads', value: (stats as any)?.leads || 0, icon: TrendingUp, color: 'bg-yellow-500' },
    { label: 'Colaboradores', value: (stats as any)?.employees || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Receita Líquida', value: formatCurrency((stats as any)?.revenue || 0), icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'OKRs Ativos', value: 2, icon: Target, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold mb-4">Receita vs Despesas</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Area type="monotone" dataKey="receita" stroke="#6366f1" fill="url(#colorReceita)" name="Receita" />
              <Area type="monotone" dataKey="despesas" stroke="#ef4444" fill="url(#colorDespesas)" name="Despesas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold mb-4">Tarefas por Status</h2>
          {taskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={taskData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                  {taskData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">Sem dados</div>
          )}
        </div>
      </div>
    </div>
  );
}
