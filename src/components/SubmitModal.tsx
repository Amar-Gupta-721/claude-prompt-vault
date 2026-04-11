'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { value: 'writing', label: 'Writing' },
  { value: 'content-strategy', label: 'Content Strategy' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'video-content', label: 'Video Content' },
  { value: 'short-video', label: 'Short Video' },
  { value: 'repurposing', label: 'Repurposing' },
  { value: 'content-ideas', label: 'Content Ideas' },
  { value: 'coding', label: 'Coding' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'research', label: 'Research' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'seo', label: 'SEO' },
  { value: 'creative', label: 'Creative' },
  { value: 'other', label: 'Other' },
];

interface FormState {
  title: string;
  category: string;
  promptText: string;
  name: string;
  email: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  category: '',
  promptText: '',
  name: '',
  email: '',
};

export default function SubmitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClose = () => {
    if (status === 'loading') return;
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus('idle');
    setServerError('');
    setCharCount(0);
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!form.category) newErrors.category = 'Please select a category';
    if (!form.promptText.trim()) newErrors.promptText = 'Prompt text is required';
    else if (form.promptText.trim().length < 20) newErrors.promptText = 'Prompt must be at least 20 characters';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
    if (field === 'promptText') setCharCount(value.length);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus('loading');
    setServerError('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setServerError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setServerError('Network error. Please check your connection and try again.');
    }
  };

  if (!open) return null;

  return (
    <div
      className={`submit-backdrop${open ? ' open' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="submit-modal">

        {/* ─── SUCCESS STATE ─── */}
        {status === 'success' ? (
          <div style={{ padding: '52px 36px', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(50,180,100,0.12)', border: '2px solid rgba(50,180,100,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', color: '#2E9E5C'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginBottom: 10, letterSpacing: '-0.5px' }}>
              Prompt submitted!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: 320, margin: '0 auto 8px' }}>
              We received your submission and will review it shortly. If we love it, we&apos;ll add it to the library and credit you by name.
            </p>
            <p style={{ fontSize: 13, color: 'var(--ink-4)', marginBottom: 28 }}>
              Submitted by <strong>{form.name || form.email}</strong>
            </p>
            <button className="btn-primary" onClick={handleClose} style={{ padding: '12px 32px', fontSize: 15 }}>
              Back to Library
            </button>
          </div>
        ) : (
          <>
            {/* ─── HEADER ─── */}
            <div className="submit-modal-header">
              <div>
                <div className="section-label" style={{ marginBottom: 4 }}>Community</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
                  Submit a Prompt
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 4 }}>
                  Share your best Claude prompt with the community.
                </p>
              </div>
              <button className="modal-close" onClick={handleClose} disabled={status === 'loading'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ─── BODY ─── */}
            <div className="submit-modal-body">

              {/* Title */}
              <div className="form-field">
                <label className="form-label">
                  Prompt Title <span style={{ color: 'var(--orange)' }}>*</span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Turn Blog Post Into 3 LinkedIn Carousels"
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  style={errors.title ? { borderColor: '#e74c3c', boxShadow: '0 0 0 3px rgba(231,76,60,0.10)' } : {}}
                />
                {errors.title && (
                  <span style={{ fontSize: 12, color: '#e74c3c', marginTop: 4 }}>⚠ {errors.title}</span>
                )}
              </div>

              {/* Category */}
              <div className="form-field">
                <label className="form-label">
                  Category <span style={{ color: 'var(--orange)' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  style={errors.category ? { borderColor: '#e74c3c', boxShadow: '0 0 0 3px rgba(231,76,60,0.10)' } : {}}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <span style={{ fontSize: 12, color: '#e74c3c', marginTop: 4 }}>⚠ {errors.category}</span>
                )}
              </div>

              {/* Prompt Text */}
              <div className="form-field">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Prompt Text <span style={{ color: 'var(--orange)' }}>*</span></span>
                  <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                    {charCount} chars
                  </span>
                </label>
                <textarea
                  className="form-textarea"
                  style={{
                    minHeight: 140,
                    ...(errors.promptText ? { borderColor: '#e74c3c', boxShadow: '0 0 0 3px rgba(231,76,60,0.10)' } : {})
                  }}
                  placeholder="Paste your full prompt here. Use [BRACKETS] for variables the user should fill in, e.g. [TOPIC], [AUDIENCE]."
                  value={form.promptText}
                  onChange={e => handleChange('promptText', e.target.value)}
                />
                {errors.promptText && (
                  <span style={{ fontSize: 12, color: '#e74c3c', marginTop: 4 }}>⚠ {errors.promptText}</span>
                )}
              </div>

              {/* Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-field">
                  <label className="form-label">
                    Your Name{' '}
                    <span style={{ color: 'var(--ink-4)', fontSize: 11, letterSpacing: 0, textTransform: 'none', fontWeight: 400 }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Alex Chen"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                  <span style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 3 }}>
                    You&apos;ll be credited by this name.
                  </span>
                </div>
                <div className="form-field">
                  <label className="form-label">
                    Email <span style={{ color: 'var(--orange)' }}>*</span>
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    style={errors.email ? { borderColor: '#e74c3c', boxShadow: '0 0 0 3px rgba(231,76,60,0.10)' } : {}}
                  />
                  {errors.email && (
                    <span style={{ fontSize: 12, color: '#e74c3c', marginTop: 4 }}>⚠ {errors.email}</span>
                  )}
                </div>
              </div>

              {/* Server error */}
              {status === 'error' && serverError && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(231,76,60,0.08)',
                  border: '1px solid rgba(231,76,60,0.25)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={{ fontSize: 13, color: '#c0392b', lineHeight: 1.5 }}>{serverError}</span>
                </div>
              )}

              {/* Guidelines */}
              <div style={{
                padding: '12px 16px',
                background: 'rgba(204,120,92,0.06)',
                border: '1px solid rgba(204,120,92,0.18)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--ink-4)',
                lineHeight: 1.65,
              }}>
                <strong style={{ color: 'var(--ink-3)' }}>Submission guidelines:</strong> Prompts should work directly with Claude. Use [BRACKETS] for user-replaceable variables. We review every submission — quality over quantity.
              </div>
            </div>

            {/* ─── FOOTER ─── */}
            <div className="submit-modal-footer">
              <button
                className="btn-secondary"
                onClick={handleClose}
                disabled={status === 'loading'}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={status === 'loading'}
                style={{ minWidth: 140, justifyContent: 'center' }}
              >
                {status === 'loading' ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                    Submit Prompt
                  </>
                )}
              </button>
            </div>

            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
}
