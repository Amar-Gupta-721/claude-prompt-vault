'use client';
import { useEffect } from 'react';

export default function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`about-backdrop${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="about-modal">
        <div className="about-modal-top">
          <div className="about-modal-top-row">
            <div className="about-modal-wordmark">
              <div className="about-modal-logo">V</div>
              <div>
                <div className="about-modal-brand-name">Claude Prompt Vault</div>
                <div className="about-modal-brand-sub">Open Prompt Library</div>
              </div>
            </div>
            <button className="about-close-btn" onClick={onClose}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <p className="about-modal-intro">Claude Prompt Vault was created to make it easier for people to discover powerful prompts without spending hours experimenting. The goal is to reduce the struggle around prompt writing and help builders focus on creating.</p>
        </div>
        <div className="about-modal-body">
          <div className="about-section-label">The Team</div>
          <div className="about-team">
            {[
              { initial: 'K', cls: 'about-avatar-1', name: 'Kshitiz Verma', role: 'Engineer & Content Creator', links: [{ href: 'https://www.linkedin.com/in/kshitizverma2712', icon: 'linkedin', label: 'LinkedIn' }, { href: 'https://www.youtube.com/@TheWhy.Guy_', icon: 'youtube', label: 'YouTube' }] },
              { initial: 'A', cls: 'about-avatar-2', name: 'Amar Gupta', role: 'Engineer & Web Development Expert', links: [{ href: 'https://www.linkedin.com/in/amar-gupta-36a3b8176', icon: 'linkedin', label: 'LinkedIn' }] },
              { initial: 'D', cls: 'about-avatar-3', name: 'Diwakar Pradhan', role: 'AI Research Contributor', links: [{ href: 'https://www.linkedin.com/in/diwakarpradhan0', icon: 'linkedin', label: 'LinkedIn' }] },
            ].map(m => (
              <div key={m.name} className="about-member">
                <div className={`about-avatar ${m.cls}`}>{m.initial}</div>
                <div className="about-member-info">
                  <div className="about-member-name">{m.name}</div>
                  <div className="about-member-role">{m.role}</div>
                  <div className="about-member-links">
                    {m.links.map(l => (
                      <a key={l.label} href={l.href} target="_blank" rel="noopener" className="about-member-link">
                        {l.icon === 'linkedin'
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                          : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>
                        }
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="about-section-label">A Note from the Team</div>
          <div className="about-bubble-wrap">
            <div className="about-bubble">
              <p>Our goal was simple. We wanted to make prompt writing easier for everyone.</p>
              <p>Instead of spending hours figuring out prompts, people should be able to discover good ones instantly and build faster.</p>
              <p>This project started as a small idea and grew into something we wanted to share with the community.</p>
              <p>Huge thanks to Amar for handling deployment and technical infrastructure.</p>
              <p>Also a big shoutout to Diwakar for helping finalize some of the best prompts and contributing to the early ideas behind the project.</p>
              <p>Thanks, guys.</p>
            </div>
            <div className="about-attribution">Kshitiz</div>
          </div>
          <div className="about-closing">
            <p>Join us in building tools that help the community create faster.</p>
            <p><strong>Thank you for using Claude Prompt Vault.</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
