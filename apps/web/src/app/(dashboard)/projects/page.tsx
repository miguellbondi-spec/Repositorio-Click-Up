'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Plus, FolderKanban, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1' });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects'),
  });

  const create = useMutation({
    mutationFn: (data: any) => api.post('/projects', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setModal(false); setForm({ name: '', description: '', color: '#6366f1' }); toast.success('Projeto criado!'); },
    onError: () => toast.error('Erro ao criar projeto'),
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">{(projects as any[]).length} projetos ativos</p>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
          <Plus className="h-4 w-4" /> Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(projects as any[]).map((p: any) => (
          <div key={p.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: p.color + '20', border: `2px solid ${p.color}` }}>
                <FolderKanban className="h-5 w-5" style={{ color: p.color }} />
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
            </div>
            <h3 className="font-semibold mb-1">{p.name}</h3>
            {p.description && <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">{p._count?.tasks || 0} tarefas</p>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Novo Projeto</h2>
              <button onClick={() => setModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome do projeto" className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Descrição do projeto" className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cor</label>
                <div className="flex gap-2 flex-wrap">
                  {['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#14b8a6'].map(c => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} className={`h-8 w-8 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-2 ring-current' : ''}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <button onClick={() => create.mutate(form)} disabled={!form.name || create.isPending} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar Projeto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
