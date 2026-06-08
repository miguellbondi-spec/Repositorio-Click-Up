const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'zacxorg-secret-2025-change-in-prod';

if (!fs.existsSync('./data')) fs.mkdirSync('./data');

const db = new sqlite3.Database('./data/zacxorg.db');

// Promisify helpers
const run = (sql, params = []) => new Promise((res, rej) => db.run(sql, params, function(err) { err ? rej(err) : res(this); }));
const get = (sql, params = []) => new Promise((res, rej) => db.get(sql, params, (err, row) => err ? rej(err) : res(row)));
const all = (sql, params = []) => new Promise((res, rej) => db.all(sql, params, (err, rows) => err ? rej(err) : res(rows)));

async function init() {
  await run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, company TEXT, created_at TEXT DEFAULT (datetime('now')))`);
  await run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, name TEXT NOT NULL, description TEXT, color TEXT DEFAULT '#6366f1', status TEXT DEFAULT 'active', created_at TEXT DEFAULT (datetime('now')))`);
  await run(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, project_id INTEGER, title TEXT NOT NULL, description TEXT, status TEXT DEFAULT 'TODO', priority TEXT DEFAULT 'MEDIUM', due_date TEXT, created_at TEXT DEFAULT (datetime('now')))`);
  await run(`CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, name TEXT NOT NULL, email TEXT, company TEXT, phone TEXT, status TEXT DEFAULT 'NEW', value REAL DEFAULT 0, notes TEXT, created_at TEXT DEFAULT (datetime('now')))`);
  await run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, type TEXT NOT NULL, category TEXT NOT NULL, description TEXT, amount REAL NOT NULL, date TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);

  // Seed demo user
  const demo = await get('SELECT id FROM users WHERE email = ?', ['demo@zacxorg.com']);
  if (!demo) {
    const hash = bcrypt.hashSync('Demo@123', 10);
    const u = await run('INSERT INTO users (name, email, password, company) VALUES (?, ?, ?, ?)', ['Demo User', 'demo@zacxorg.com', hash, 'Empresa Demo']);
    const uid = u.lastID;
    const p1 = await run('INSERT INTO projects (user_id, name, description, color) VALUES (?, ?, ?, ?)', [uid, 'Projeto Principal', 'Projeto de demonstração', '#6366f1']);
    await run('INSERT INTO projects (user_id, name, description, color) VALUES (?, ?, ?, ?)', [uid, 'Website Redesign', 'Reformulação do site', '#22c55e']);
    const pid = p1.lastID;
    await run('INSERT INTO tasks (user_id, project_id, title, status, priority) VALUES (?, ?, ?, ?, ?)', [uid, pid, 'Configurar ambiente', 'DONE', 'HIGH']);
    await run('INSERT INTO tasks (user_id, project_id, title, status, priority) VALUES (?, ?, ?, ?, ?)', [uid, pid, 'Criar dashboard', 'IN_PROGRESS', 'HIGH']);
    await run('INSERT INTO tasks (user_id, project_id, title, status, priority) VALUES (?, ?, ?, ?, ?)', [uid, pid, 'Integração API', 'TODO', 'MEDIUM']);
    await run('INSERT INTO tasks (user_id, project_id, title, status, priority) VALUES (?, ?, ?, ?, ?)', [uid, pid, 'Testes de usabilidade', 'BACKLOG', 'LOW']);
    await run('INSERT INTO leads (user_id, name, email, company, status, value) VALUES (?, ?, ?, ?, ?, ?)', [uid, 'João Silva', 'joao@tech.com', 'Tech Corp', 'QUALIFIED', 15000]);
    await run('INSERT INTO leads (user_id, name, email, company, status, value) VALUES (?, ?, ?, ?, ?, ?)', [uid, 'Maria Santos', 'maria@startup.io', 'Startup IO', 'PROPOSAL', 8500]);
    await run('INSERT INTO leads (user_id, name, email, company, status, value) VALUES (?, ?, ?, ?, ?, ?)', [uid, 'Pedro Costa', 'pedro@ind.com', 'Indústria XYZ', 'NEW', 25000]);
    await run('INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, ?)', [uid, 'INCOME', 'Vendas', 'Contrato cliente A', 15000, '2025-01-15']);
    await run('INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, ?)', [uid, 'INCOME', 'Serviços', 'Consultoria mensal', 8000, '2025-02-01']);
    await run('INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, ?)', [uid, 'EXPENSE', 'Infraestrutura', 'Servidores', 2500, '2025-02-05']);
    await run('INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, ?)', [uid, 'EXPENSE', 'Marketing', 'Google Ads', 3000, '2025-02-10']);
    await run('INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, ?)', [uid, 'INCOME', 'Vendas', 'Contrato cliente B', 22000, '2025-03-01']);
    console.log('Demo data seeded.');
  }
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, company } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (exists) return res.status(409).json({ error: 'Email já em uso' });
    const hash = bcrypt.hashSync(password, 10);
    const result = await run('INSERT INTO users (name, email, password, company) VALUES (?, ?, ?, ?)', [name, email, hash, company || '']);
    const token = jwt.sign({ id: result.lastID, name, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.lastID, name, email, company } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, company: user.company } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const uid = req.user.id;
    const [{ c: projects }, { c: tasks }, { c: leads }, incRow, expRow, tasksByStatus, recentTasks] = await Promise.all([
      get('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [uid]),
      get('SELECT COUNT(*) as c FROM tasks WHERE user_id = ?', [uid]),
      get('SELECT COUNT(*) as c FROM leads WHERE user_id = ?', [uid]),
      get("SELECT COALESCE(SUM(amount),0) as s FROM transactions WHERE user_id = ? AND type = 'INCOME'", [uid]),
      get("SELECT COALESCE(SUM(amount),0) as s FROM transactions WHERE user_id = ? AND type = 'EXPENSE'", [uid]),
      all('SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY status', [uid]),
      all('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [uid]),
    ]);
    res.json({ projects, tasks, leads, income: incRow.s, expense: expRow.s, balance: incRow.s - expRow.s, tasksByStatus, recentTasks });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── PROJECTS ──────────────────────────────────────────────────────────────────

app.get('/api/projects', auth, async (req, res) => {
  try { res.json(await all('SELECT p.*, (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count FROM projects p WHERE p.user_id = ? ORDER BY created_at DESC', [req.user.id])); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/projects', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const r = await run('INSERT INTO projects (user_id, name, description, color) VALUES (?, ?, ?, ?)', [req.user.id, name, description || '', color || '#6366f1']);
    res.json(await get('SELECT * FROM projects WHERE id = ?', [r.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/projects/:id', auth, async (req, res) => {
  try {
    const { name, description, color, status } = req.body;
    const p = await get('SELECT * FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    await run('UPDATE projects SET name = ?, description = ?, color = ?, status = ? WHERE id = ?', [name || p.name, description ?? p.description, color || p.color, status || p.status, req.params.id]);
    res.json(await get('SELECT * FROM projects WHERE id = ?', [req.params.id]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  try { await run('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── TASKS ─────────────────────────────────────────────────────────────────────

app.get('/api/tasks', auth, async (req, res) => {
  try {
    const { project_id } = req.query;
    const sql = 'SELECT t.*, p.name as project_name FROM tasks t LEFT JOIN projects p ON p.id = t.project_id WHERE t.user_id = ?' + (project_id ? ' AND t.project_id = ?' : '') + ' ORDER BY t.created_at DESC';
    res.json(await all(sql, project_id ? [req.user.id, project_id] : [req.user.id]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/tasks', auth, async (req, res) => {
  try {
    const { title, description, status, priority, project_id, due_date } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const r = await run('INSERT INTO tasks (user_id, project_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.user.id, project_id || null, title, description || '', status || 'TODO', priority || 'MEDIUM', due_date || null]);
    res.json(await get('SELECT * FROM tasks WHERE id = ?', [r.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/tasks/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    const t = await get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!t) return res.status(404).json({ error: 'Not found' });
    await run('UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?', [title || t.title, description ?? t.description, status || t.status, priority || t.priority, due_date ?? t.due_date, req.params.id]);
    res.json(await get('SELECT * FROM tasks WHERE id = ?', [req.params.id]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/tasks/:id', auth, async (req, res) => {
  try { await run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── LEADS ─────────────────────────────────────────────────────────────────────

app.get('/api/leads', auth, async (req, res) => {
  try { res.json(await all('SELECT * FROM leads WHERE user_id = ? ORDER BY created_at DESC', [req.user.id])); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/leads', auth, async (req, res) => {
  try {
    const { name, email, company, phone, status, value, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const r = await run('INSERT INTO leads (user_id, name, email, company, phone, status, value, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.user.id, name, email || '', company || '', phone || '', status || 'NEW', value || 0, notes || '']);
    res.json(await get('SELECT * FROM leads WHERE id = ?', [r.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/leads/:id', auth, async (req, res) => {
  try {
    const { name, email, company, phone, status, value, notes } = req.body;
    const l = await get('SELECT * FROM leads WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!l) return res.status(404).json({ error: 'Not found' });
    await run('UPDATE leads SET name=?,email=?,company=?,phone=?,status=?,value=?,notes=? WHERE id=?', [name||l.name, email??l.email, company??l.company, phone??l.phone, status||l.status, value??l.value, notes??l.notes, req.params.id]);
    res.json(await get('SELECT * FROM leads WHERE id = ?', [req.params.id]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/leads/:id', auth, async (req, res) => {
  try { await run('DELETE FROM leads WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── TRANSACTIONS ──────────────────────────────────────────────────────────────

app.get('/api/transactions', auth, async (req, res) => {
  try { res.json(await all('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [req.user.id])); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/transactions', auth, async (req, res) => {
  try {
    const { type, category, description, amount, date } = req.body;
    if (!type || !amount) return res.status(400).json({ error: 'Missing fields' });
    const r = await run('INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, ?)', [req.user.id, type, category || 'Outros', description || '', amount, date || new Date().toISOString().split('T')[0]]);
    res.json(await get('SELECT * FROM transactions WHERE id = ?', [r.lastID]));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/transactions/:id', auth, async (req, res) => {
  try { await run('DELETE FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── HEALTH & FALLBACK ─────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

init().then(() => {
  app.listen(PORT, () => console.log(`ZacxOrg running on http://localhost:${PORT}`));
}).catch(err => { console.error('Init error:', err); process.exit(1); });
