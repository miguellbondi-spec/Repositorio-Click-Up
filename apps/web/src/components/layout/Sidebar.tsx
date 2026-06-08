'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, MessageSquare,
  FileText, TrendingUp, DollarSign, Target, UserCog, Settings,
  Bell, BarChart2, Zap, ChevronLeft, ChevronRight, Building2
} from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projetos', icon: FolderKanban },
  { href: '/tasks', label: 'Tarefas', icon: CheckSquare },
  { href: '/crm', label: 'CRM', icon: TrendingUp },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/documents', label: 'Documentos', icon: FileText },
  { href: '/finance', label: 'Financeiro', icon: DollarSign },
  { href: '/okr', label: 'OKR', icon: Target },
  { href: '/hr', label: 'RH', icon: UserCog },
  { href: '/reports', label: 'Relatórios', icon: BarChart2 },
  { href: '/notifications', label: 'Notificações', icon: Bell },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside className={cn(
      'flex flex-col bg-gray-900 text-gray-100 transition-all duration-300 relative',
      sidebarCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center h-16 px-4 border-b border-gray-700">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-lg text-white">ZacxOrg</span>
          </div>
        )}
        {sidebarCollapsed && <Building2 className="h-6 w-6 text-indigo-400 mx-auto" />}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-700',
              pathname === href ? 'bg-indigo-600 text-white' : 'text-gray-300',
              sidebarCollapsed && 'justify-center px-2'
            )}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 absolute -right-5 top-1/2 -translate-y-1/2 border border-gray-600"
      >
        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
