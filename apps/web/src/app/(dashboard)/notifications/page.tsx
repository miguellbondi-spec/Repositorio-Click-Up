'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Bell, Check, Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { data: notifications = [], isLoading } = useQuery({ queryKey: ['notifications'], queryFn: () => api.get('/notifications') });

  const markAllRead = useMutation({
    mutationFn: () => api.put('/notifications/read-all', {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  const list = notifications as any[];
  const unread = list.filter((n: any) => !n.isRead).length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{unread} não lidas</p>
        {unread > 0 && (
          <button onClick={() => markAllRead.mutate()} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            <Check className="h-3 w-3" /> Marcar todas como lidas
          </button>
        )}
      </div>
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {list.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Nenhuma notificação</p>
          </div>
        ) : list.map((n: any) => (
          <div key={n.id} className={`p-4 flex gap-3 ${!n.isRead ? 'bg-indigo-50 dark:bg-indigo-950/20' : ''}`}>
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: n.isRead ? 'transparent' : '#6366f1' }} />
            <div className="flex-1">
              <p className="font-medium text-sm">{n.title}</p>
              {n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
              <p className="text-xs text-muted-foreground mt-1">{formatDate(n.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
