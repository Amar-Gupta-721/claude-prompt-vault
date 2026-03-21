'use client';
import { useEffect, useState } from 'react';

interface Prompt { _id: string; title: string; category: string; author: string; preview: string; full: string; }

export default function PromptModal({ prompt, onClose, onCopy, onDownload, getCatClass, getCatLabel, getInitials }: {
  prompt: Prompt | null;
  onClose: () => void;
  onCopy: (p: Prompt) => void;
  onDownload: (p: Prompt) => void;
  getCatClass: (c: string) => string;
  getCatLabel: (c: string) => string;
  getInitials: (s: string) => string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!prompt) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [prompt, onClose]);

  if (!prompt) return null;

  const handleCopy = () => {
    onCopy(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`modal-backdrop${prompt ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-category">
              <span className={`card-category ${getCatClass(prompt.category)}`}>{getCatLabel(prompt.category)}</span>
            </div>
            <div className="modal-title">{prompt.title}</div>
            <div className="modal-author">
              <div className="modal-author-avatar">{getInitials(prompt.author)}</div>
              <span>by {prompt.author}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="modal-body">
          <pre className="modal-prompt-text">{prompt.full}</pre>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={handleCopy}>
            {copied
              ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Copied!</>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copy Prompt</>
            }
          </button>
          <button className="btn-secondary" onClick={() => onDownload(prompt)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
