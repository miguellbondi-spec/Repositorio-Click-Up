'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { UserCog, Building, Loader2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function HrPage() {
  const { data: employees = [], isLoading } = useQuery({ queryKey: ['employees'], queryFn: () => api.get('/hr/employees') });
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: () => api.get('/hr/departments') });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><UserCog className="h-5 w-5 text-blue-600" /></div>
          <div><p className="text-2xl font-bold">{(employees as any[]).length}</p><p className="text-xs text-muted-foreground">Colaboradores</p></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Building className="h-5 w-5 text-green-600" /></div>
          <div><p className="text-2xl font-bold">{(departments as any[]).length}</p><p className="text-xs text-muted-foreground">Departamentos</p></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border"><h2 className="font-semibold">Colaboradores</h2></div>
        <div className="divide-y divide-border">
          {(employees as any[]).map((emp: any) => (
            <div key={emp.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {getInitials(emp.name)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{emp.name}</p>
                <p className="text-sm text-muted-foreground">{emp.position || 'Sem cargo'} • {emp.department?.name || 'Sem departamento'}</p>
              </div>
              <div className="text-right">
                {emp.salary && <p className="font-medium text-sm">{formatCurrency(emp.salary)}</p>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {emp.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
