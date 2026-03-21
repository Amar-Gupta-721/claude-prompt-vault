'use client';
import { useState, useEffect } from 'react';

export default function SubmitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ title: '', category: '', full: '', name: '', email: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  const handleClose = () => {
    setForm({ title: '', category: '', full: '', name: '', email: '' });
    setSuccess(false); setError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.full || !form.email) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true); setError('');
    // In a real setup, this would email/store the submission for admin review
    // For now we show success after a short delay
    setTimeout(() => { setLoading(false); setSuccess(true); }, 800);
  };

  if (!open) return null;

  return (
    <div className={`submit-backdrop${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="submit-modal">
        {!success ? (
          <>
            <div className="submit-modal-header">
              <div>
                <div className="section-label" style={{ marginBottom: 4 }}>Submit a Prompt</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.3px' }}>Share your best prompt</div>
              </div>
              <button className="modal-close" onClick={handleClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="submit-modal-body">
              <div className="form-field">
                <label className="form-label">Prompt Title <span>*</span></label>
                <input className="form-input" type="text" placeholder="e.g. Turn Blog Post Into 3 LinkedIn Carousels" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-field">
                <label className="form-label">Category <span>*</span></label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select a category…</option>
                  <option value="writing">Writing</option>
                  <option value="content-strategy">Content Strategy</option>
                  <option value="social-media">Social Media</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="youtube">YouTube</option>
                  <option value="video-content">Video Content</option>
                  <option value="coding">Coding</option>
                  <option value="analysis">Analysis</option>
                  <option value="research">Research</option>
                  <option value="marketing">Marketing</option>
                  <option value="productivity">Productivity</option>
                  <option value="seo">SEO</option>
                  <option value="repurposing">Repurposing</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Prompt Text <span>*</span></label>
                <textarea className="form-textarea" placeholder="Paste your full prompt here. Use [BRACKETS] for variables." value={form.full} onChange={e => setForm(f => ({ ...f, full: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-field">
                  <label className="form-label">Your Name <span style={{ color: 'var(--ink-4)', fontSize: 11, letterSpacing: 0, textTransform: 'none' }}>(optional)</span></label>
                  <input className="form-input" type="text" placeholder="e.g. Alex Chen" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">Email <span>*</span></label>
                  <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
            </div>
            <div className="submit-modal-footer">
              <button className="btn-secondary" onClick={handleClose}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
                {loading ? 'Submitting…' : 'Submit Prompt'}
              </button>
            </div>
          </>
        ) : (
          <div className="submit-modal-success visible">
            <div className="success-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>Thanks for submitting!</h3>
            <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>If we love your prompt, we&apos;ll add it to the library and credit you by name.</p>
            <button className="btn-primary" onClick={handleClose} style={{ marginTop: 20 }}>Back to Library</button>
          </div>
        )}
      </div>
    </div>
  );
}
