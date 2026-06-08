'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancePage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({ queryKey: ['finance-summary'], queryFn: () => api.get('/finance/summary') });
  const { data: transactions = [], isLoading } = useQuery({ queryKey: ['transactions'], queryFn: () => api.get('/finance/transactions') });

  if (isLoading || loadingSummary) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  const s = summary as any || {};
  const txList = transactions as any[];

  const chartData = [
    { name: 'Receita', value: s.income || 0, fill: '#22c55e' },
    { name: 'Despesas', value: s.expenses || 0, fill: '#ef4444' },
    { name: 'Saldo', value: s.balance || 0, fill: '#6366f1' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-green-600" /></div>
          <div><p className="text-2xl font-bold text-green-600">{formatCurrency(s.income || 0)}</p><p className="text-xs text-muted-foreground">Receita Total</p></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><TrendingDown className="h-5 w-5 text-red-600" /></div>
          <div><p className="text-2xl font-bold text-red-600">{formatCurrency(s.expenses || 0)}</p><p className="text-xs text-muted-foreground">Despesas Totais</p></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-indigo-600" /></div>
          <div><p className={`text-2xl font-bold ${(s.balance || 0) >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>{formatCurrency(s.balance || 0)}</p><p className="text-xs text-muted-foreground">Saldo Líquido</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Resumo Financeiro</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="value" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border"><h2 className="font-semibold">Transações Recentes</h2></div>
          <div className="divide-y divide-border">
            {txList.slice(0, 6).map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">{tx.description || tx.category}</p>
                  <p className="text-xs text-muted-foreground">{tx.category} • {formatDate(tx.date)}</p>
                </div>
                <span className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
