'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

interface HeaderProps { title: string; }

export function Header({ title }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-accent">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="p-2 rounded-lg hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user.name)}
            </div>
            <span className="text-sm hidden md:block">{user.name}</span>
          </div>
        )}
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
