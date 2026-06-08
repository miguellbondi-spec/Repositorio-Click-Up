'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Send, Hash, Loader2 } from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';

export default function ChatPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: channels = [] } = useQuery({ queryKey: ['channels'], queryFn: () => api.get('/chat/channels') });
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedChannel],
    queryFn: () => api.get(`/chat/channels/${selectedChannel}/messages`),
    enabled: !!selectedChannel,
  });

  useEffect(() => {
    if ((channels as any[]).length > 0 && !selectedChannel) {
      setSelectedChannel((channels as any[])[0].id);
    }
  }, [channels]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useMutation({
    mutationFn: () => api.post(`/chat/channels/${selectedChannel}/messages`, { content: message }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['messages', selectedChannel] }); setMessage(''); },
  });

  const channelList = channels as any[];
  const messageList = [...(messages as any[])].reverse();

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-card rounded-xl border border-border overflow-hidden">
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border"><h2 className="font-semibold text-sm">Canais</h2></div>
        <div className="flex-1 overflow-y-auto p-2">
          {channelList.map((ch: any) => (
            <button key={ch.id} onClick={() => setSelectedChannel(ch.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedChannel === ch.id ? 'bg-indigo-600 text-white' : 'hover:bg-accent'}`}>
              <Hash className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div> : null}
              {messageList.map((msg: any) => (
                <div key={msg.id} className={`flex gap-3 ${msg.author?.id === user?.id ? 'flex-row-reverse' : ''}`}>
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(msg.author?.name || 'U')}
                  </div>
                  <div className={`max-w-[70%] ${msg.author?.id === user?.id ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm ${msg.author?.id === user?.id ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{msg.author?.name}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && message.trim() && send.mutate()}
                placeholder="Digite uma mensagem..." className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={() => send.mutate()} disabled={!message.trim() || send.isPending}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Selecione um canal</div>
        )}
      </div>
    </div>
  );
}
