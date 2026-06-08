const API = {
  base: '/api',

  token() { return localStorage.getItem('token'); },

  headers() {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token()}` };
  },

  async req(method, path, body) {
    const res = await fetch(this.base + path, {
      method,
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  },

  get: (path) => API.req('GET', path),
  post: (path, body) => API.req('POST', path, body),
  put: (path, body) => API.req('PUT', path, body),
  del: (path) => API.req('DELETE', path)
};

function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

function requireAuth() {
  if (!API.token()) { window.location.href = '/'; }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

function toast(msg, type = 'success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:10px;font-size:.875rem;font-weight:500;color:white;background:${type === 'success' ? '#22c55e' : '#ef4444'};box-shadow:0 4px 12px rgba(0,0,0,.15);animation:slidein .3s ease`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function fmt(n) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n); }
function fmtDate(d) { return d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—'; }
function initials(name) { return (name || '').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase(); }

function statusBadge(s) {
  const map = {
    BACKLOG: ['badge-backlog','Backlog'], TODO: ['badge-todo','A Fazer'],
    IN_PROGRESS: ['badge-progress','Em Progresso'], IN_REVIEW: ['badge-review','Em Revisão'],
    DONE: ['badge-done','Concluído'], CANCELLED: ['badge-cancelled','Cancelado'],
    NEW: ['badge-new','Novo'], CONTACTED: ['badge-contacted','Contactado'],
    QUALIFIED: ['badge-qualified','Qualificado'], PROPOSAL: ['badge-proposal','Proposta'],
    NEGOTIATION: ['badge-negotiation','Negociação'], WON: ['badge-won','Ganho'], LOST: ['badge-lost','Perdido']
  };
  const [cls, label] = map[s] || ['badge-backlog', s];
  return `<span class="badge ${cls}">${label}</span>`;
}

function priorityLabel(p) {
  const map = { URGENT: 'Urgente', HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa' };
  return `<span class="priority-${p.toLowerCase()}">${map[p] || p}</span>`;
}

function renderSidebar(active) {
  const user = getUser();
  const nav = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard.html', icon: `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>` },
    { id: 'projects', label: 'Projetos', href: '/projects.html', icon: `<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>` },
    { id: 'tasks', label: 'Tarefas', href: '/tasks.html', icon: `<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>` },
    { id: 'crm', label: 'CRM', href: '/crm.html', icon: `<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>` },
    { id: 'finance', label: 'Financeiro', href: '/finance.html', icon: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>` },
  ];
  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
      <span>ZacxOrg</span>
    </div>
    <nav>
      ${nav.map(n => `
        <a class="nav-item ${active === n.id ? 'active' : ''}" href="${n.href}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${n.icon}</svg>
          <span>${n.label}</span>
        </a>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">${initials(user?.name || 'U')}</div>
        <div class="user-name">${user?.name || 'Usuário'}</div>
        <button class="logout-btn" onclick="logout()" title="Sair" style="margin-left:auto">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
      </div>
    </div>
  </aside>
  <button class="toggle-btn" id="toggleBtn" onclick="document.getElementById('sidebar').classList.toggle('collapsed')">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
  </button>`;
}

const style = document.createElement('style');
style.textContent = `@keyframes slidein{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;
document.head.appendChild(style);
