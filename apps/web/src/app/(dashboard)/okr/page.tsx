'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Target, Loader2 } from 'lucide-react';

export default function OkrPage() {
  const { data: okrs = [], isLoading } = useQuery({ queryKey: ['okrs'], queryFn: () => api.get('/okr') });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-4">
      {(okrs as any[]).map((okr: any) => (
        <div key={okr.id} className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">{okr.title}</h3>
                <p className="text-xs text-muted-foreground">{okr.quarter} {okr.year}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">{okr.progress}%</p>
              <p className="text-xs text-muted-foreground">progresso</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${okr.progress}%` }} />
          </div>
          {Array.isArray(okr.keyResults) && okr.keyResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Results</p>
              {okr.keyResults.map((kr: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{kr.title}</span>
                    <span className="font-medium">{kr.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${kr.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
