'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency, LEAD_STATUS_LABELS } from '@/lib/utils';
import { TrendingUp, DollarSign, Users, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CrmPage() {
  const qc = useQueryClient();
  const { data: leads = [], isLoading } = useQuery({ queryKey: ['leads'], queryFn: () => api.get('/crm/leads') });
  const { data: deals = [] } = useQuery({ queryKey: ['deals'], queryFn: () => api.get('/crm/deals') });

  const updateLead = useMutation({
    mutationFn: ({ id, status }: any) => api.put(`/crm/leads/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); toast.success('Status atualizado!'); },
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  const leadList = leads as any[];
  const dealList = deals as any[];
  const totalValue = leadList.reduce((sum: number, l: any) => sum + (l.value || 0), 0);

  const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
  const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-gray-100 text-gray-700', CONTACTED: 'bg-blue-100 text-blue-700',
    QUALIFIED: 'bg-indigo-100 text-indigo-700', PROPOSAL: 'bg-yellow-100 text-yellow-700',
    NEGOTIATION: 'bg-orange-100 text-orange-700', WON: 'bg-green-100 text-green-700', LOST: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-indigo-600" /></div>
          <div><p className="text-2xl font-bold">{leadList.length}</p><p className="text-xs text-muted-foreground">Total de Leads</p></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Users className="h-5 w-5 text-green-600" /></div>
          <div><p className="text-2xl font-bold">{dealList.length}</p><p className="text-xs text-muted-foreground">Negócios Abertos</p></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-yellow-600" /></div>
          <div><p className="text-2xl font-bold">{formatCurrency(totalValue)}</p><p className="text-xs text-muted-foreground">Valor Total do Pipeline</p></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">Pipeline de Leads</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Nome</th>
              <th className="text-left p-3 font-medium">Empresa</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Valor</th>
              <th className="text-left p-3 font-medium">Responsável</th>
            </tr>
          </thead>
          <tbody>
            {leadList.map((lead: any) => (
              <tr key={lead.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-3 font-medium">{lead.name}</td>
                <td className="p-3 text-muted-foreground">{lead.company || '—'}</td>
                <td className="p-3">
                  <select value={lead.status} onChange={e => updateLead.mutate({ id: lead.id, status: e.target.value })}
                    className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS_COLORS[lead.status]}`}>
                    {STATUSES.map(s => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
                  </select>
                </td>
                <td className="p-3">{lead.value ? formatCurrency(lead.value) : '—'}</td>
                <td className="p-3 text-muted-foreground">{lead.owner?.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
