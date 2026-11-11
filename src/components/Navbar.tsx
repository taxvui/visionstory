'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { useVisionStory } from './VisionStoryProvider';
import { CREATOR_TOOLS } from '@/lib/catalog';
import { VisionStoryPrismLogo } from './Icons';

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, user, setAuthModalOpen, setLedgerModalOpen } = useVisionStory();
  const [openMenu, setOpenMenu] = useState<'features' | 'solutions' | 'resources' | 'lang' | null>(null);

  // Real app.visionstory.ai Studio has NO top marketing navbar — only its floating left sidebar + top-right bar!
  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return (
    <div className="vs-mkt-header-wrap" onMouseLeave={() => setOpenMenu(null)}>
      <header className="vs-mkt-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 38 }}>
          <Link href="/" className="vs-brand" id="nav-brand-logo">
            <VisionStoryPrismLogo size={28} boxed={false} />
            <span>VisionStory</span>
          </Link>

          <nav className="vs-nav-links" aria-label="Main navigation">
            {/* Features */}
            <div className="vs-nav-item" onMouseEnter={() => setOpenMenu('features')}>
              <button type="button" className="vs-btn-ghost" id="nav-features-trigger">
                <span>{locale === 'vi' ? 'Tính năng' : 'Features'}</span>
                <ChevronDown size={14} style={{ opacity: 0.65 }} />
              </button>
              {openMenu === 'features' && (
                <div className="vs-dropdown-panel">
                  <div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        padding: '0 10px 8px',
                      }}
                    >
                      AI Video Studio
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                      {[
                        { title: 'AI Video', sub: 'V-Character 4.0 Talking Avatars', href: '/studio?tab=ai-video' },
                        { title: 'AI Agent', sub: 'Prompt or deck to multi-shot video', href: '/studio?tab=ai-agent' },
                        { title: 'Viral Music', sub: 'Solo & Duet singing lip-sync', href: '/studio?tab=viral-music' },
                        { title: 'Face Swap', sub: 'Instant video & photo face swap', href: '/studio?tab=face-swap' },
                        { title: 'Seedance 2.5', sub: 'Cinematic reference-to-video', href: '/studio?tab=seedance' },
                        { title: 'Video Podcast', sub: 'Two-host studio conversations', href: '/studio?tab=podcast' },
                        { title: 'AI Presentation', sub: 'Turn slides into engaging video', href: '/studio?tab=presentation' },
                        { title: 'Voice Clone', sub: 'Clone voices across 88 languages', href: '/studio?tab=ai-tools&tool=voice-clone' },
                      ].map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="vs-dropdown-link"
                          onClick={() => setOpenMenu(null)}
                        >
                          <span style={{ fontWeight: 650, fontSize: '0.86rem', color: '#fff' }}>{item.title}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.sub}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      borderLeft: '1px solid var(--border-hairline)',
                      paddingLeft: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          marginBottom: 8,
                        }}
                      >
                        Creator AI Tools
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {CREATOR_TOOLS.slice(4, 11).map((tItem) => (
                          <Link
                            key={tItem.slug}
                            href={`/studio?tab=${tItem.studioTab}${tItem.studioSubTool ? `&tool=${tItem.studioSubTool}` : ''}`}
                            className="vs-tag"
                            onClick={() => setOpenMenu(null)}
                          >
                            {locale === 'vi' ? tItem.titleVi : tItem.titleEn}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#151722',
                        borderRadius: 14,
                        padding: 14,
                        border: '1px solid var(--border-hairline)',
                      }}
                    >
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>
                        Launch VisionStory Studio
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                        160+ avatars · 1,000+ voices · 88 languages
                      </p>
                      <Link
                        href="/studio"
                        className="vs-btn vs-btn-primary vs-btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => setOpenMenu(null)}
                      >
                        Get started FREE →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions */}
            <div className="vs-nav-item" onMouseEnter={() => setOpenMenu('solutions')}>
              <button type="button" className="vs-btn-ghost" id="nav-solutions-trigger">
                <span>{locale === 'vi' ? 'Giải pháp' : 'Solutions'}</span>
                <ChevronDown size={14} style={{ opacity: 0.65 }} />
              </button>
              {openMenu === 'solutions' && (
                <div className="vs-dropdown-panel" style={{ width: 410, gridTemplateColumns: '1fr 1fr' }}>
                  {[
                    { title: 'Video Creators', sub: 'YouTube, TikTok & Reels' },
                    { title: 'Marketing Teams', sub: 'UGC & Product Launch Ads' },
                    { title: 'Sales Teams', sub: 'Personalized Outreach' },
                    { title: 'Learning & Development', sub: 'Slides to Training Video' },
                    { title: 'Agencies', sub: 'Multi-Brand Client Scale' },
                    { title: 'Creator Monetization', sub: 'AI Virtual Influencers' },
                  ].map((s) => (
                    <Link
                      key={s.title}
                      href="/tools#solutions"
                      className="vs-dropdown-link"
                      onClick={() => setOpenMenu(null)}
                    >
                      <span style={{ fontWeight: 650, fontSize: '0.85rem' }}>{s.title}</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.sub}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources */}
            <div className="vs-nav-item" onMouseEnter={() => setOpenMenu('resources')}>
              <button type="button" className="vs-btn-ghost" id="nav-resources-trigger">
                <span>{locale === 'vi' ? 'Tài nguyên' : 'Resources'}</span>
                <ChevronDown size={14} style={{ opacity: 0.65 }} />
              </button>
              {openMenu === 'resources' && (
                <div className="vs-dropdown-panel" style={{ width: 390, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <Link href="/tools" className="vs-dropdown-link" onClick={() => setOpenMenu(null)}>
                      <span style={{ fontWeight: 650, fontSize: '0.85rem' }}>AI Tools Hub</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>All VisionStory tools</span>
                    </Link>
                    <Link href="/tools#models" className="vs-dropdown-link" onClick={() => setOpenMenu(null)}>
                      <span style={{ fontWeight: 650, fontSize: '0.85rem' }}>Video Models</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>V-Character, Seedance, Kling</span>
                    </Link>
                  </div>
                  <div>
                    <Link href="/tools#comparisons" className="vs-dropdown-link" onClick={() => setOpenMenu(null)}>
                      <span style={{ fontWeight: 650, fontSize: '0.85rem' }}>Comparisons</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>vs HeyGen, Synthesia, D-ID</span>
                    </Link>
                    <Link href="/openapi" className="vs-dropdown-link" onClick={() => setOpenMenu(null)}>
                      <span style={{ fontWeight: 650, fontSize: '0.85rem' }}>CLI, SDK & MCP</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Developer & Agent tools</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="vs-btn-ghost"
              style={pathname === '/pricing' ? { color: 'var(--accent-brand)' } : undefined}
            >
              {locale === 'vi' ? 'Bảng giá' : 'Pricing'}
            </Link>

            <Link
              href="/openapi"
              className="vs-btn-ghost"
              style={pathname === '/openapi' ? { color: 'var(--accent-brand)' } : undefined}
            >
              API
            </Link>
          </nav>
        </div>

        {/* Right Controls matching home.png 1:1: [🌐 English ⌄] + [Log In] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="vs-nav-item">
            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
              className="vs-btn vs-btn-secondary vs-btn-sm"
              style={{ height: 36, padding: '0 14px', gap: 7, fontWeight: 560 }}
              id="nav-locale-toggle"
              title="Switch English / Tiếng Việt"
            >
              <Globe size={14} style={{ opacity: 0.8 }} />
              <span>{locale === 'en' ? 'English' : 'Tiếng Việt'}</span>
              <ChevronDown size={13} style={{ opacity: 0.6 }} />
            </button>
          </div>

          {user.provider !== 'demo' && (
            <button
              type="button"
              onClick={() => setLedgerModalOpen(true)}
              className="vs-btn vs-btn-secondary vs-btn-sm"
              style={{ height: 36, padding: '0 13px' }}
            >
              <span>{user.credits} Credits</span>
            </button>
          )}

          {user.provider === 'demo' ? (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="vs-btn vs-btn-primary vs-btn-sm"
              style={{ height: 36, padding: '0 18px' }}
              id="nav-auth-btn"
            >
              {locale === 'vi' ? 'Đăng nhập' : 'Log In'}
            </button>
          ) : (
            <Link
              href="/studio"
              className="vs-btn vs-btn-primary vs-btn-sm"
              style={{ height: 36, padding: '0 18px' }}
            >
              {user.name} · Studio
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
