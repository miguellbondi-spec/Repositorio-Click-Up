'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, cn } from '@/lib/utils';
import { Plus, List, Kanban, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export default function TasksPage() {
  const qc = useQueryClient();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => api.get('/projects') });
  const [selectedProject, setSelectedProject] = useState('');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', selectedProject],
    queryFn: () => api.get(`/tasks${selectedProject ? `?projectId=${selectedProject}` : ''}`),
  });

  const create = useMutation({
    mutationFn: (data: any) => api.post('/tasks', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setModal(false); toast.success('Tarefa criada!'); },
    onError: () => toast.error('Erro ao criar tarefa'),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: any) => api.put(`/tasks/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  const taskList = tasks as any[];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="px-3 py-2 border border-input rounded-lg bg-background text-sm">
          <option value="">Todos os projetos</option>
          {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="flex rounded-lg border border-input overflow-hidden ml-auto">
          <button onClick={() => setView('kanban')} className={cn('px-3 py-2', view === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-background hover:bg-accent')}><Kanban className="h-4 w-4" /></button>
          <button onClick={() => setView('list')} className={cn('px-3 py-2', view === 'list' ? 'bg-indigo-600 text-white' : 'bg-background hover:bg-accent')}><List className="h-4 w-4" /></button>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
          <Plus className="h-4 w-4" /> Nova Tarefa
        </button>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map(status => {
            const statusTasks = taskList.filter(t => t.status === status);
            return (
              <div key={status} className="flex-shrink-0 w-72">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-medium">{TASK_STATUS_LABELS[status]}</h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{statusTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {statusTasks.map((task: any) => (
                    <div key={task.id} className="bg-card rounded-lg border border-border p-3 cursor-pointer hover:shadow-sm">
                      <p className="text-sm font-medium mb-2">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', TASK_STATUS_COLORS[task.status])}>{TASK_STATUS_LABELS[task.status]}</span>
                        <span className={cn('text-xs font-medium', PRIORITY_COLORS[task.priority])}>{PRIORITY_LABELS[task.priority]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Tarefa</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Prioridade</th>
                <th className="text-left p-3 font-medium">Responsável</th>
              </tr>
            </thead>
            <tbody>
              {taskList.map((task: any) => (
                <tr key={task.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 font-medium">{task.title}</td>
                  <td className="p-3"><span className={cn('px-2 py-1 rounded-full text-xs', TASK_STATUS_COLORS[task.status])}>{TASK_STATUS_LABELS[task.status]}</span></td>
                  <td className="p-3"><span className={cn('text-xs font-medium', PRIORITY_COLORS[task.priority])}>{PRIORITY_LABELS[task.priority]}</span></td>
                  <td className="p-3 text-muted-foreground">{task.assignee?.name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Nova Tarefa</h2>
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título da tarefa" className="w-full px-3 py-2 border border-input rounded-lg bg-background" />
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 border border-input rounded-lg bg-background">
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full px-3 py-2 border border-input rounded-lg bg-background">
                <option value="">Selecione um projeto</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={() => setModal(false)} className="flex-1 py-2 border border-border rounded-lg hover:bg-accent">Cancelar</button>
                <button onClick={() => create.mutate({ ...form, projectId: selectedProject })} disabled={!form.title || !selectedProject || create.isPending} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
                  {create.isPending ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
