'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Prompt { _id: string; title: string; category: string; author: string; preview: string; full: string; createdAt: string; }
interface Skill { _id: string; name: string; desc: string; icon: string; tag: string; github: string; }
interface Stats { prompts: number; skillRepos: number; copiesMade: number; }

const EMPTY_PROMPT = { title: '', category: 'writing', author: '', preview: '', full: '' };
const CATEGORIES = ['writing','content-strategy','social-media','linkedin','twitter','youtube','video-content','coding','analysis','research','marketing','productivity','seo','repurposing','creative','short-video'];

export default function AdminDashboardClient({ initialPrompts, initialSkills, stats }: {
  initialPrompts: Prompt[];
  initialSkills: Skill[];
  stats: Stats;
}) {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [skills] = useState<Skill[]>(initialSkills);
  const [tab, setTab] = useState<'prompts' | 'skills'>('prompts');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_PROMPT);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const openAdd = () => { setForm(EMPTY_PROMPT); setEditId(null); setError(''); setAddOpen(true); };
  const openEdit = (p: Prompt) => { setForm({ title: p.title, category: p.category, author: p.author, preview: p.preview, full: p.full }); setEditId(p._id); setError(''); setAddOpen(true); };
  const closeAdd = () => { setAddOpen(false); setEditId(null); setError(''); };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.author || !form.preview || !form.full) { setError('All fields are required.'); return; }
    setSaving(true); setError('');
    try {
      if (editId) {
        const res = await fetch(`/api/prompts/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const data = await res.json();
        if (!res.ok) { setError(data.error); setSaving(false); return; }
        setPrompts(prev => prev.map(p => p._id === editId ? { ...p, ...data.prompt } : p));
        showToast('Prompt updated!');
      } else {
        const res = await fetch('/api/prompts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const data = await res.json();
        if (!res.ok) { setError(data.error); setSaving(false); return; }
        setPrompts(prev => [data.prompt, ...prev]);
        showToast('Prompt added!');
      }
      closeAdd();
    } catch { setError('Something went wrong.'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
    if (res.ok) { setPrompts(prev => prev.filter(p => p._id !== id)); showToast('Prompt deleted.'); }
    setDeleteConfirm(null);
  };

  const CAT_LABELS: Record<string, string> = { 'content-strategy': 'Content Strategy', 'social-media': 'Social Media', linkedin: 'LinkedIn', 'video-content': 'Video', repurposing: 'Repurposing', twitter: 'Twitter', youtube: 'YouTube', 'short-video': 'Short Video', 'content-ideas': 'Ideas', writing: 'Writing', coding: 'Coding', marketing: 'Marketing', research: 'Research', productivity: 'Productivity', seo: 'SEO', analysis: 'Analysis', creative: 'Creative' };
  const catLabel = (c: string) => CAT_LABELS[c] ?? c;

  return (
    <div className="admin-layout">
      {/* Nav */}
      <div className="admin-nav">
        <a href="/" className="admin-nav-brand">
          <span style={{ fontSize: 20 }}>🔮</span>
          Prompt Vault <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, fontFamily: 'var(--font-body)', fontSize: 13 }}>/ Admin</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>View Site</a>
          <button className="btn-secondary" style={{ fontSize: 13, padding: '7px 14px' }} onClick={handleLogout}>Sign out</button>
        </div>
      </div>

      <div className="admin-content">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: 'var(--ink-4)' }}>Manage prompts, skills, and monitor stats.</p>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          {[
            { label: 'Total Prompts', value: prompts.length, color: 'var(--orange)' },
            { label: 'Skill Repos', value: skills.length, color: '#2A5A7C' },
            { label: 'Copies Made', value: stats.copiesMade.toLocaleString(), color: '#2A7C5C' },
          ].map(s => (
            <div key={s.label} className="admin-stat-card">
              <div className="admin-stat-num" style={{ color: s.color }}>{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid var(--border)' }}>
          {(['prompts', 'skills'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 20px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: tab === t ? 'var(--orange)' : 'var(--ink-4)', borderBottom: tab === t ? '2px solid var(--orange)' : '2px solid transparent', marginBottom: -2, transition: 'all 0.2s', textTransform: 'capitalize' }}>
              {t === 'prompts' ? `Prompts (${prompts.length})` : `Skills (${skills.length})`}
            </button>
          ))}
        </div>

        {/* Prompts Tab */}
        {tab === 'prompts' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button className="btn-primary" onClick={openAdd}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Prompt
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prompts.map(p => (
                    <tr key={p._id}>
                      <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{p.title}</td>
                      <td><span className="admin-badge" style={{ background: 'rgba(204,120,92,0.12)', color: 'var(--orange)', border: '1px solid rgba(204,120,92,0.22)' }}>{catLabel(p.category)}</span></td>
                      <td style={{ color: 'var(--ink-3)' }}>{p.author}</td>
                      <td style={{ color: 'var(--ink-4)', fontSize: 12 }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openEdit(p)}>Edit</button>
                          <button className="card-btn" style={{ background: 'rgba(192,57,43,0.10)', color: '#c0392b', border: '1px solid rgba(192,57,43,0.22)', padding: '5px 12px' }} onClick={() => setDeleteConfirm(p._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {prompts.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-4)', padding: 40 }}>No prompts yet. Add your first one!</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Skills Tab */}
        {tab === 'skills' && (
          <div style={{ overflowX: 'auto' }}>
            <p style={{ fontSize: 13, color: 'var(--ink-4)', marginBottom: 16 }}>Skills are seeded from the database. Use the seed API to add more, or manage directly in MongoDB.</p>
            <table className="admin-table">
              <thead>
                <tr><th>Repo</th><th>Tag</th><th>GitHub</th></tr>
              </thead>
              <tbody>
                {skills.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td><span className="admin-badge" style={{ background: 'rgba(42,90,124,0.12)', color: '#2A5A7C', border: '1px solid rgba(42,90,124,0.22)' }}>{s.tag}</span></td>
                    <td><a href={s.github} target="_blank" rel="noopener" style={{ color: 'var(--orange)', fontSize: 12 }}>View ↗</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Prompt Modal */}
      {addOpen && (
        <div className="modal-backdrop open" onClick={e => { if (e.target === e.currentTarget) closeAdd(); }}>
          <div className="modal" style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-title">{editId ? 'Edit Prompt' : 'Add New Prompt'}</div>
              </div>
              <button className="modal-close" onClick={closeAdd}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-field">
                <label className="form-label">Title <span>*</span></label>
                <input className="form-input" type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Prompt title" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-field">
                  <label className="form-label">Category <span>*</span></label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Author <span>*</span></label>
                  <input className="form-input" type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Author name" />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Preview <span>*</span></label>
                <textarea className="form-textarea" style={{ minHeight: 72 }} value={form.preview} onChange={e => setForm(f => ({ ...f, preview: e.target.value }))} placeholder="Short description shown on the card" />
              </div>
              <div className="form-field">
                <label className="form-label">Full Prompt <span>*</span></label>
                <textarea className="form-textarea" style={{ minHeight: 140 }} value={form.full} onChange={e => setForm(f => ({ ...f, full: e.target.value }))} placeholder="Full prompt text. Use [BRACKETS] for variables." />
              </div>
              {error && <p style={{ color: '#c0392b', fontSize: 13, margin: 0 }}>{error}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Prompt'}
              </button>
              <button className="btn-secondary" onClick={closeAdd}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-backdrop open" onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <div className="modal-title">Delete Prompt?</div>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>This action cannot be undone. The prompt will be permanently removed from the database.</p>
            </div>
            <div className="modal-footer">
              <button className="card-btn" style={{ background: 'rgba(192,57,43,0.12)', color: '#c0392b', border: '1px solid rgba(192,57,43,0.22)', padding: '9px 20px', fontSize: 14, fontWeight: 600 }} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast${toast ? ' show' : ''}`}>
        <div className="toast-dot" />
        <span>{toast}</span>
      </div>
    </div>
  );
}
