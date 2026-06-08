'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, PRIORITY_LABELS, cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const { data: taskReport, isLoading } = useQuery({ queryKey: ['task-report'], queryFn: () => api.get('/reports/tasks') });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  const report = taskReport as any;
  const statusData = report?.byStatus?.map((s: any) => ({ name: TASK_STATUS_LABELS[s.status] || s.status, value: s._count })) || [];
  const priorityData = report?.byPriority?.map((p: any) => ({ name: PRIORITY_LABELS[p.priority] || p.priority, value: p._count })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Tarefas por Status</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[4,4,0,0]} name="Tarefas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Tarefas por Prioridade</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Bar dataKey="value" fill="#f59e0b" radius={[4,4,0,0]} name="Tarefas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
