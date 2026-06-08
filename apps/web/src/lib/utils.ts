import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export const TASK_STATUS_LABELS: Record<string, string> = {
  BACKLOG: 'Backlog', TODO: 'A Fazer', IN_PROGRESS: 'Em Progresso',
  IN_REVIEW: 'Em Revisão', DONE: 'Concluído', CANCELLED: 'Cancelado',
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  BACKLOG: 'bg-gray-100 text-gray-700', TODO: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700', IN_REVIEW: 'bg-purple-100 text-purple-700',
  DONE: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

export const PRIORITY_LABELS: Record<string, string> = {
  URGENT: 'Urgente', HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa',
};

export const PRIORITY_COLORS: Record<string, string> = {
  URGENT: 'text-red-600', HIGH: 'text-orange-500', MEDIUM: 'text-yellow-500', LOW: 'text-blue-400',
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: 'Novo', CONTACTED: 'Contactado', QUALIFIED: 'Qualificado',
  PROPOSAL: 'Proposta', NEGOTIATION: 'Negociação', WON: 'Ganho', LOST: 'Perdido',
};
