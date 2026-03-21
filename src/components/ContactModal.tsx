'use client';
import { useState, useEffect } from 'react';

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  const handleClose = () => { setForm({ name: '', email: '', message: '' }); setSuccess(false); onClose(); };

  const handleSubmit = async () => {
    if (!form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 800);
  };

  if (!open) return null;

  return (
    <div className={`contact-backdrop${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="contact-modal">
        {!success ? (
          <div id="contactFormView">
            <div className="contact-modal-top">
              <div className="contact-modal-top-row">
                <div className="contact-modal-wordmark">
                  <div className="contact-modal-logo">V</div>
                  <div>
                    <div className="contact-modal-brand-name">Claude Prompt Vault</div>
                    <div className="contact-modal-brand-sub">Get in touch</div>
                  </div>
                </div>
                <button className="contact-close-btn" onClick={handleClose}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="contact-modal-heading">Say hello.</div>
              <div className="contact-modal-sub">
                <p>We read every message. Yes, really.</p>
                <p>If a prompt completely broke Claude&apos;s brain, <em>definitely tell us.</em></p>
              </div>
            </div>
            <div className="contact-modal-body">
              <div className="contact-form-grid">
                <div className="form-field">
                  <label className="form-label">Name <span style={{ color: 'var(--ink-4)', fontSize: 11, letterSpacing: 0, textTransform: 'none' }}>(optional)</span></label>
                  <input className="form-input" type="text" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">Email <span>*</span></label>
                  <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="form-field" style={{ marginBottom: 20 }}>
                <label className="form-label">Message / Feedback <span>*</span></label>
                <textarea className="form-textarea" style={{ minHeight: 130 }} placeholder="Tell us what's on your mind…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={handleClose}>Cancel</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </div>
            <div className="contact-modal-footer-strip">
              <div className="contact-footer-label">You can also reach us here</div>
              <div className="contact-footer-links">
                {[
                  { href: 'https://www.linkedin.com/in/kshitizverma2712', label: 'Kshitiz' },
                  { href: 'https://www.linkedin.com/in/amar-gupta-36a3b8176', label: 'Amar' },
                  { href: 'https://www.linkedin.com/in/diwakarpradhan0', label: 'Diwakar' },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener" className="contact-footer-link">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="contact-success visible">
            <div className="contact-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>Message received.</h3>
            <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>If it&apos;s brilliant we&apos;ll reply. If it&apos;s chaotic we&apos;ll probably screenshot it.</p>
            <button className="btn-primary" onClick={handleClose} style={{ marginTop: 16 }}>Back to Library</button>
          </div>
        )}
      </div>
    </div>
  );
}
