'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PromptModal from './PromptModal';
import SubmitModal from './SubmitModal';
import ContactModal from './ContactModal';
import AboutModal from './AboutModal';

interface Prompt {
  _id: string;
  title: string;
  category: string;
  author: string;
  preview: string;
  full: string;
}

interface Skill {
  _id: string;
  name: string;
  desc: string;
  icon: string;
  tag: string;
  github: string;
}

interface Stats {
  prompts: number;
  skillRepos: number;
  copiesMade: number;
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'writing', label: 'Writing' },
  { value: 'content-strategy', label: 'Content Strategy' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'video-content', label: 'Video' },
  { value: 'repurposing', label: 'Repurposing' },
  { value: 'coding', label: 'Coding' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'research', label: 'Research' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'seo', label: 'SEO' },
];

const CAT_CLASS_MAP: Record<string, string> = {
  writing: 'cat-writing', coding: 'cat-coding', marketing: 'cat-marketing',
  research: 'cat-research', productivity: 'cat-productivity', seo: 'cat-seo',
  analysis: 'cat-analysis', creative: 'cat-creative',
  'content-strategy': 'cat-content-strategy', 'social-media': 'cat-social-media',
  linkedin: 'cat-linkedin', 'video-content': 'cat-video-content',
  repurposing: 'cat-repurposing', twitter: 'cat-twitter', youtube: 'cat-youtube',
  'short-video': 'cat-short-video', 'content-ideas': 'cat-content-ideas',
};

const CAT_LABEL_MAP: Record<string, string> = {
  'content-strategy': 'Content Strategy', 'social-media': 'Social Media',
  linkedin: 'LinkedIn', 'video-content': 'Video', repurposing: 'Repurposing',
  twitter: 'Twitter', youtube: 'YouTube', 'short-video': 'Short Video',
  'content-ideas': 'Ideas', writing: 'Writing', coding: 'Coding',
  marketing: 'Marketing', research: 'Research', productivity: 'Productivity',
  seo: 'SEO', analysis: 'Analysis', creative: 'Creative',
};

function getCatClass(cat: string) { return CAT_CLASS_MAP[cat] ?? 'cat-writing'; }
function getCatLabel(cat: string) { return CAT_LABEL_MAP[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1)); }
function getInitials(name: string) { return name.split(' ').map(n => n[0]).join('').toUpperCase(); }

export default function HomeClient({ initialPrompts, initialSkills, initialStats }: {
  initialPrompts: Prompt[];
  initialSkills: Skill[];
  initialStats: Stats;
}) {
  const [prompts] = useState<Prompt[]>(initialPrompts);
  const [skills] = useState<Skill[]>(initialSkills);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'prompts' | 'skills'>('all');
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<Prompt | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Load saved bookmarks
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_prompts') ?? '[]');
      setSavedIds(new Set(saved));
    } catch {}
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedIds(prev => new Set(Array.from(prev).concat(id)));
    setTimeout(() => setCopiedIds(prev => { const n = new Set(prev); n.delete(id); return n; }), 2000);
    showToast('Prompt copied to clipboard!');
    // Increment copy count in DB
    fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'increment_copy' }) })
      .then(r => r.json()).then(d => setStats(s => ({ ...s, copiesMade: d.copiesMade })));
  }, [showToast]);

  const toggleBookmark = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast('Removed from saved'); }
      else { next.add(id); showToast('Saved to bookmarks!'); }
      localStorage.setItem('saved_prompts', JSON.stringify(Array.from(next)));
      return next;
    });
  }, [showToast]);

  // Filtering
  const filteredPrompts = prompts.filter(p => {
    const catOk = activeFilter === 'all' || p.category === activeFilter;
    const q = searchQuery.toLowerCase();
    const searchOk = !q || p.title.toLowerCase().includes(q) || p.preview.toLowerCase().includes(q) || p.full.toLowerCase().includes(q);
    return catOk && searchOk;
  });
  const filteredSkills = skills.filter(s => {
    const q = searchQuery.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q);
  });
  const showPrompts = searchType === 'all' || searchType === 'prompts';
  const showSkills = searchType === 'all' || searchType === 'skills';
  const visiblePrompts = showPrompts ? filteredPrompts : [];
  const visibleSkills = showSkills ? filteredSkills : [];
  const bothVisible = showPrompts && showSkills && visiblePrompts.length > 0 && visibleSkills.length > 0;

  const downloadPrompt = (p: Prompt) => {
    const blob = new Blob([p.full], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <div className="nav-logo-mark">🔮</div>
            Claude Prompt Vault
          </a>
          <ul className="nav-links">
            <li><a href="#prompts">Prompts</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#community">Community</a></li>
            <li><button className="btn-ghost" onClick={() => setAboutOpen(true)}>About</button></li>
          </ul>
          <div className="nav-cta">
            <button className="btn-ghost" onClick={() => setContactOpen(true)}>Contact</button>
            <button className="btn-primary" onClick={() => setSubmitOpen(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Submit Prompt
            </button>
          </div>
          <button className={`nav-hamburger${mobileNavOpen ? ' open' : ''}`} onClick={() => setMobileNavOpen(v => !v)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      {mobileNavOpen && (
        <div className="nav-mobile-panel open">
          <a href="#prompts" className="nav-mobile-link" onClick={() => setMobileNavOpen(false)}>Prompts</a>
          <a href="#skills" className="nav-mobile-link" onClick={() => setMobileNavOpen(false)}>Skills</a>
          <a href="#community" className="nav-mobile-link" onClick={() => setMobileNavOpen(false)}>Community</a>
          <div className="nav-mobile-divider" />
          <button className="nav-mobile-link btn-ghost" style={{ textAlign: 'left', width: '100%' }} onClick={() => { setAboutOpen(true); setMobileNavOpen(false); }}>About</button>
          <button className="nav-mobile-link btn-ghost" style={{ textAlign: 'left', width: '100%' }} onClick={() => { setContactOpen(true); setMobileNavOpen(false); }}>Contact</button>
          <button className="btn-primary" style={{ marginTop: 8 }} onClick={() => { setSubmitOpen(true); setMobileNavOpen(false); }}>Submit Prompt</button>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          Free. Open Source. Community Driven.
        </div>
        {/* <h1>The Best Claude Prompts.<br /><em>Instantly Copy. Instantly Build.</em> </h1> */}
        <h1>Unlock Claude's<br /><em>Full Power</em> </h1>
        <p className="hero-sub">A curated library of prompts, skills, and workflows. Stop guessing. Start building.</p>
        <div className="hero-actions">
          <a href="#prompts" className="btn-primary" style={{ fontSize: 15, padding: '13px 28px', borderRadius: 10 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            Browse Prompts
          </a>
          <button className="btn-secondary" style={{ fontSize: 15, padding: '13px 28px', borderRadius: 10 }} onClick={() => setSubmitOpen(true)}>
            Submit a Prompt
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">{stats.prompts}+</div>
            <div className="hero-stat-label">Prompts</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-num">{stats.skillRepos}</div>
            <div className="hero-stat-label">Skill Repos</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-num">{stats.copiesMade.toLocaleString()}</div>
            <div className="hero-stat-label">Copies Made</div>
          </div>
        </div>
      </section>

      {/* ─── PROMPTS SECTION ─── */}
      <section className="section" id="prompts">
        <div className="container">
          <div className="section-header">
            <div className="section-header-row">
              <div>
                <div className="section-label">Prompt Library</div>
                <h2 className="section-title">Find your <em>perfect</em> prompt</h2>
                <p className="section-desc">Handpicked, tested, and ready to copy. Search or filter by category.</p>
              </div>
              <button className="btn-secondary" onClick={() => setSubmitOpen(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Submit a Prompt
              </button>
            </div>
          </div>

          {/* Search controls */}
          <div className="search-controls">
            <div className="search-wrap" style={{ maxWidth: 480, marginBottom: 0 }}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Search prompts and skills…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="search-type-toggle">
              {(['all', 'prompts', 'skills'] as const).map(type => (
                <button key={type} className={`stt-btn${searchType === type ? ' active' : ''}`} onClick={() => setSearchType(type)}>
                  {type === 'all' && <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> All <span className="stt-count">{filteredPrompts.length + filteredSkills.length}</span></>}
                  {type === 'prompts' && <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> Prompts <span className="stt-count">{filteredPrompts.length}</span></>}
                  {type === 'skills' && <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> Skills <span className="stt-count">{filteredSkills.length}</span></>}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter (hide when only skills) */}
          {searchType !== 'skills' && (
            <div className="filter-bar">
              {CATEGORIES.map(cat => (
                <button key={cat.value} className={`filter-btn${activeFilter === cat.value ? ' active' : ''}`} onClick={() => setActiveFilter(cat.value)}>
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          {(searchQuery || searchType !== 'all' || activeFilter !== 'all') && (
            <div className="results-count-row">
              {showPrompts && <span className="results-pill results-pill-prompt"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>{visiblePrompts.length} prompt{visiblePrompts.length !== 1 ? 's' : ''}</span>}
              {showPrompts && showSkills && <span className="results-sep" />}
              {showSkills && <span className="results-pill results-pill-skill"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>{visibleSkills.length} skill{visibleSkills.length !== 1 ? 's' : ''}</span>}
            </div>
          )}

          {/* Unified results */}
          {visiblePrompts.length === 0 && visibleSkills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 0', color: 'var(--ink-4)' }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>🔍</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-3)', marginBottom: 8 }}>Nothing found</div>
              <div style={{ fontSize: 14 }}>Try different keywords or switch the filter above</div>
            </div>
          ) : (
            <>
              {showPrompts && visiblePrompts.length > 0 && (
                <>
                  {bothVisible && (
                    <div className="results-section-label">
                      <span className="result-type-badge type-prompt">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                        Prompts
                      </span>
                      {visiblePrompts.length} result{visiblePrompts.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="unified-grid" style={{ marginBottom: bothVisible && visibleSkills.length > 0 ? 32 : 0 }}>
                    {visiblePrompts.map(p => (
                      <div key={p._id} className="prompt-card" onClick={() => setActiveModal(p)}>
                        <div className="card-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span className="result-type-badge type-prompt">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                              Prompt
                            </span>
                            <span className={`card-category ${getCatClass(p.category)}`}>{getCatLabel(p.category)}</span>
                          </div>
                          <button
                            className={`card-bookmark${savedIds.has(p._id) ? ' saved' : ''}`}
                            onClick={e => { e.stopPropagation(); toggleBookmark(p._id); }}
                            aria-label="Save prompt"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={savedIds.has(p._id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                          </button>
                        </div>
                        <div className="card-title">{p.title}</div>
                        <div className="card-preview">{p.preview}</div>
                        <div className="card-meta">
                          <div className="card-author">
                            <div className="card-author-avatar">{getInitials(p.author)}</div>
                            {p.author}
                          </div>
                          <div className="card-actions">
                            <button
                              className={`card-btn card-btn-copy${copiedIds.has(p._id) ? ' copied' : ''}`}
                              onClick={e => { e.stopPropagation(); copyToClipboard(p.full, p._id); }}
                            >
                              {copiedIds.has(p._id)
                                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Copied!</>
                                : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copy</>
                              }
                            </button>
                            <button className="card-btn card-btn-view" onClick={e => { e.stopPropagation(); setActiveModal(p); }}>View Full</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {showSkills && visibleSkills.length > 0 && (
                <div className={`skills-bg skills-bg-results${bothVisible ? ' skills-bg-both' : ''}`}>
                  {bothVisible ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                      <div className="section-label" style={{ marginBottom: 0 }}>Claude Skills</div>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{visibleSkills.length} repo{visibleSkills.length !== 1 ? 's' : ''}</span>
                    </div>
                  ) : (
                    <div style={{ marginBottom: 28 }}>
                      <div className="section-label">Claude Skills</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', marginTop: 6 }}>
                        Extend Claude with <em style={{ fontStyle: 'italic', color: 'var(--orange-pale)', fontWeight: 300 }}>skills</em>
                      </div>
                    </div>
                  )}
                  <div className="skills-grid">
                    {visibleSkills.map(s => {
                      const parts = s.name.split('/');
                      const user = parts[0];
                      const repo = parts[1] ?? s.name;
                      return (
                        <a key={s._id} href={s.github} target="_blank" rel="noopener" className="skill-card">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                            <div className="skill-icon">{s.icon}</div>
                            <span className="skill-tag">{s.tag}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginBottom: 3 }}>{user} /</div>
                            <div className="skill-name">{repo}</div>
                          </div>
                          <div className="skill-desc">{s.desc}</div>
                          <div className="skill-footer">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'rgba(255,255,255,0.30)' }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>Open Repository</span>
                            </div>
                            <span className="skill-link-btn">
                              View on GitHub
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── SKILLS SECTION (standalone dark) ─── */}
      <section className="section" id="skills">
        <div className="skills-bg">
          <div className="section-header-row">
            <div>
              <div className="section-label">Claude Skills</div>
              <h2 className="section-title">Extend Claude with <em>skills</em></h2>
              <p className="section-desc">Community-built MCP server repos that give Claude new superpowers.</p>
            </div>
          </div>
          <div className="skills-grid">
            {skills.map(s => {
              const parts = s.name.split('/');
              const user = parts[0];
              const repo = parts[1] ?? s.name;
              return (
                <a key={s._id} href={s.github} target="_blank" rel="noopener" className="skill-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div className="skill-icon">{s.icon}</div>
                    <span className="skill-tag">{s.tag}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginBottom: 3 }}>{user} /</div>
                    <div className="skill-name">{repo}</div>
                  </div>
                  <div className="skill-desc">{s.desc}</div>
                  <div className="skill-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'rgba(255,255,255,0.30)' }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>Open Repository</span>
                    </div>
                    <span className="skill-link-btn">
                      View on GitHub
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY SECTION ─── */}
      <section className="section" id="community">
        <div className="community-section">
          <div className="community-inner">
            <div>
              <h2 className="community-title">Have a <em>killer prompt?</em><br />Share it with the world.</h2>
              <p className="community-desc">Every prompt in this library was contributed by someone who wanted to save the next person the headache. Add yours and get credited by name.</p>
            </div>
            <div className="community-actions">
              <button className="btn-white" onClick={() => setSubmitOpen(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Submit a Prompt
              </button>
              <button className="btn-outline-white" onClick={() => setContactOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <div className="footer-logo-mark">🔮</div>
              Claude Prompt Vault
            </a>
            <p className="footer-tagline">The internet&apos;s best Claude prompts. Free forever. Community driven.</p>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Library</div>
            <ul>
              <li><a href="#prompts">All Prompts</a></li>
              <li><a href="#skills">Claude Skills</a></li>
              <li><a href="#community">Community</a></li>
              <li><button className="btn-ghost" style={{ padding: '0', color: 'rgba(255,255,255,0.55)', fontSize: 14 }} onClick={() => setSubmitOpen(true)}>Submit a Prompt</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Categories</div>
            <ul>
              <li><a href="#prompts">Writing</a></li>
              <li><a href="#prompts">Coding</a></li>
              <li><a href="#prompts">Marketing</a></li>
              <li><a href="#prompts">Research</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Links</div>
            <ul>
              <li><button className="btn-ghost" style={{ padding: 0, color: 'rgba(255,255,255,0.55)', fontSize: 14 }} onClick={() => setAboutOpen(true)}>About</button></li>
              <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
              <li><a href="#">License (MIT)</a></li>
              <li><button className="btn-ghost" style={{ padding: 0, color: 'rgba(255,255,255,0.55)', fontSize: 14 }} onClick={() => setContactOpen(true)}>Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Claude Prompt Vault. Open source. MIT License.</p>
          <div className="footer-social">
            <a href="#" className="social-btn" aria-label="GitHub">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
            </a>
            <a href="#" className="social-btn" aria-label="Twitter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* ─── MODALS ─── */}
      <PromptModal
        prompt={activeModal}
        onClose={() => setActiveModal(null)}
        onCopy={p => copyToClipboard(p.full, p._id)}
        onDownload={downloadPrompt}
        getCatClass={getCatClass}
        getCatLabel={getCatLabel}
        getInitials={getInitials}
      />
      <SubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      {/* ─── TOAST ─── */}
      <div className={`toast${toastVisible ? ' show' : ''}`}>
        <div className="toast-dot" />
        <span>{toastMsg}</span>
      </div>
    </>
  );
}
