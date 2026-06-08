'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projetos',
  '/tasks': 'Tarefas',
  '/crm': 'CRM',
  '/chat': 'Chat',
  '/documents': 'Documentos',
  '/finance': 'Financeiro',
  '/okr': 'OKR',
  '/hr': 'Recursos Humanos',
  '/reports': 'Relatórios',
  '/notifications': 'Notificações',
  '/settings': 'Configurações',
  '/ai': 'Assistente IA',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  if (!accessToken) return null;

  const title = PAGE_TITLES[pathname] || 'ZacxOrg';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
