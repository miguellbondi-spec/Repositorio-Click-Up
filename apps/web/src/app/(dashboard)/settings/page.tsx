'use client';

import { useAuthStore } from '@/store/auth.store';
import { useTheme } from 'next-themes';
import { getInitials } from '@/lib/utils';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Perfil</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <div>
            <p className="font-medium text-lg">{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Aparência</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Tema</p>
            <p className="text-sm text-muted-foreground">Escolha entre claro e escuro</p>
          </div>
          <div className="flex rounded-lg border border-input overflow-hidden">
            <button onClick={() => setTheme('light')} className={`px-4 py-2 text-sm ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-background hover:bg-accent'}`}>Claro</button>
            <button onClick={() => setTheme('dark')} className={`px-4 py-2 text-sm ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-background hover:bg-accent'}`}>Escuro</button>
          </div>
        </div>
      </div>
    </div>
  );
}
