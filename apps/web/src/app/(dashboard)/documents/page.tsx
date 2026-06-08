'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FileText, Loader2 } from 'lucide-react';

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useQuery({ queryKey: ['documents'], queryFn: () => api.get('/documents') });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(documents as any[]).map((doc: any) => (
        <div key={doc.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{doc.title}</h3>
              <p className="text-xs text-muted-foreground">{formatDate(doc.updatedAt)}</p>
            </div>
          </div>
          {doc.content && <p className="text-sm text-muted-foreground line-clamp-3">{doc.content.replace(/<[^>]*>/g, '')}</p>}
        </div>
      ))}
      {(documents as any[]).length === 0 && (
        <div className="col-span-3 text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum documento encontrado</p>
        </div>
      )}
    </div>
  );
}
