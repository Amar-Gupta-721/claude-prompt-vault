'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/admin');
    } else {
      setError(data.error ?? 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--orange), var(--kraft))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔮</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Prompt Vault</div>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Admin Dashboard</div>
          </div>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: 'var(--ink)', marginBottom: 6, letterSpacing: '-0.5px' }}>Sign in</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 28 }}>Admin access only.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-field">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" autoComplete="username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" autoComplete="current-password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: 13, margin: 0 }}>{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8, justifyContent: 'center', padding: '12px 24px', fontSize: 15 }}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: 'var(--ink-4)', textDecoration: 'none' }}>← Back to site</a>
        </div>
      </div>
    </div>
  );
}
