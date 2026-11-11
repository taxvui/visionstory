'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Coins,
  Globe,
  KeyRound,
  Sparkles,
  User,
  Gift,
} from 'lucide-react';
import { useVisionStory } from './VisionStoryProvider';
import { CREATOR_TOOLS } from '@/lib/catalog';

export function Navbar() {
  const pathname = usePathname();
  const {
    locale,
    setLocale,
    t,
    user,
    setAuthModalOpen,
    setSettingsModalOpen,
    setLedgerModalOpen,
    claimWeeklyBonus,
  } = useVisionStory();

  const [openMenu, setOpenMenu] = useState<'features' | 'solutions' | 'resources' | null>(null);

  const isStudio = pathname?.startsWith('/studio');

  return (
    <header
      className="vs-header"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="vs-container vs-header-inner" style={isStudio ? { maxWidth: '100%' } : undefined}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <Link href="/" className="vs-brand" id="nav-brand-logo">
            <span className="vs-brand-mark">V</span>
            <span>VisionStory</span>
            {isStudio && (
              <span className="vs-tag vs-tag-brand" style={{ marginLeft: 4 }}>
                Studio
              </span>
            )}
          </Link>

          <nav className="vs-nav-links" aria-label="Main navigation">
            {/* Features Mega Dropdown */}
            <div
              className="vs-nav-item"
              onMouseEnter={() => setOpenMenu('features')}
            >
              <button
                type="button"
                className="vs-btn-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 560 }}
                id="nav-features-trigger"
              >
                {t.nav.features} <ChevronDown size={14} />
              </button>

              {openMenu === 'features' && (
                <div className="vs-dropdown-panel">
                  <div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--text-muted)',
                        marginBottom: 8,
                        paddingLeft: 10,
                      }}
                    >
                      AI Video Suite
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                      {CREATOR_TOOLS.slice(0, 8).map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/studio?tab=${tool.studioTab}${tool.studioSubTool ? `&tool=${tool.studioSubTool}` : ''}`}
                          className="vs-dropdown-link"
                          onClick={() => setOpenMenu(null)}
                        >
                          <span style={{ fontWeight: 650, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                            {locale === 'vi' ? tool.titleVi : tool.titleEn}
                          </span>
                          <span style={{ fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                            {(locale === 'vi' ? tool.descVi : tool.descEn).slice(0, 62)}…
                          </span>
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
                      gap: 14,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--text-muted)',
                          marginBottom: 8,
                        }}
                      >
                        More AI Tools
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {[
                          { label: 'Voice Clone', href: '/studio?tab=ai-tools&tool=voice-clone' },
                          { label: 'Text to Speech', href: '/studio?tab=ai-tools&tool=tts' },
                          { label: 'AI Image 2K', href: '/studio?tab=ai-tools&tool=image-gen' },
                          { label: 'Remove Background', href: '/studio?tab=ai-tools&tool=bg-remove' },
                          { label: '4× Upscale', href: '/studio?tab=ai-tools&tool=upscale' },
                          { label: 'Remove Noise', href: '/studio?tab=ai-tools&tool=audio-clean' },
                          { label: 'AI Pet Video', href: '/studio?tab=ai-video&avatar=av_golden_pet' },
                        ].map((m) => (
                          <Link
                            key={m.label}
                            href={m.href}
                            className="vs-tag"
                            onClick={() => setOpenMenu(null)}
                          >
                            {m.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'var(--bg-surface)',
                        padding: 14,
                        borderRadius: 12,
                        border: '1px solid var(--border-hairline)',
                      }}
                    >
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>
                        {locale === 'vi' ? 'Tạo video đầu tiên trong 2 phút' : 'Create your first AI video in minutes'}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                        V-Character 4.0 · 1,000+ Voices · 88 Languages
                      </p>
                      <Link
                        href="/studio"
                        className="vs-btn vs-btn-primary vs-btn-sm"
                        onClick={() => setOpenMenu(null)}
                      >
                        {t.nav.studio} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div
              className="vs-nav-item"
              onMouseEnter={() => setOpenMenu('solutions')}
            >
              <button
                type="button"
                className="vs-btn-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 560 }}
                id="nav-solutions-trigger"
              >
                {t.nav.solutions} <ChevronDown size={14} />
              </button>
              {openMenu === 'solutions' && (
                <div className="vs-dropdown-panel" style={{ width: 420, gridTemplateColumns: '1fr 1fr' }}>
                  {[
                    { title: 'Video Creators', sub: 'YouTube, Shorts & Reels' },
                    { title: 'Marketing Teams', sub: 'UGC & Product Launch Ads' },
                    { title: 'Sales Enablement', sub: 'Personalized Outreach' },
                    { title: 'Learning & Development', sub: 'Slides to Training Video' },
                    { title: 'Agencies', sub: 'Client Delivery at Scale' },
                    { title: 'Creator Monetization', sub: 'Virtual AI Influencers' },
                  ].map((s) => (
                    <Link
                      key={s.title}
                      href="/tools#solutions"
                      className="vs-dropdown-link"
                      onClick={() => setOpenMenu(null)}
                    >
                      <span style={{ fontWeight: 650, fontSize: '0.87rem' }}>{s.title}</span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{s.sub}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources & AI Landscape Dropdown */}
            <div
              className="vs-nav-item"
              onMouseEnter={() => setOpenMenu('resources')}
            >
              <button
                type="button"
                className="vs-btn-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 560 }}
                id="nav-resources-trigger"
              >
                {t.nav.resources} <ChevronDown size={14} />
              </button>
              {openMenu === 'resources' && (
                <div className="vs-dropdown-panel" style={{ width: 390, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 10px 6px' }}>
                      LEARN
                    </div>
                    <Link href="/tools#tutorials" className="vs-dropdown-link" onClick={() => setOpenMenu(null)}>
                      <span style={{ fontWeight: 650, fontSize: '0.87rem' }}>Tutorials & Guides</span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Step-by-step workflows</span>
                    </Link>
                    <Link href="/tools#comparisons" className="vs-dropdown-link" onClick={() => setOpenMenu(null)}>
                      <span style={{ fontWeight: 650, fontSize: '0.87rem' }}>Comparisons</span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>vs HeyGen, Synthesia, D-ID</span>
                    </Link>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 10px 6px' }}>
                      AI LANDSCAPE
                    </div>
                    <Link href="/tools#models" className="vs-dropdown-link" onClick={() => setOpenMenu(null)}>
                      <span style={{ fontWeight: 650, fontSize: '0.87rem' }}>AI Models Catalog</span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>V-Character, Seedance, Kling</span>
                    </Link>
                    <Link href="/openapi" className="vs-dropdown-link" onClick={() => setOpenMenu(null)}>
                      <span style={{ fontWeight: 650, fontSize: '0.87rem' }}>CLI, SDK & MCP</span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Agent-ready developer docs</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/tools" className="vs-btn-ghost" style={{ fontWeight: 560 }}>
              {t.nav.tools}
            </Link>
            <Link href="/pricing" className="vs-btn-ghost" style={{ fontWeight: 560 }}>
              {t.nav.pricing}
            </Link>
            <Link href="/openapi" className="vs-btn-ghost" style={{ fontWeight: 560 }}>
              {t.nav.api}
            </Link>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Credits Pill + Weekly Visit Bonus */}
          <button
            type="button"
            onClick={() => setLedgerModalOpen(true)}
            className="vs-tag vs-tag-teal"
            style={{ padding: '6px 11px', cursor: 'pointer' }}
            title="View Credit Usage Details"
            id="nav-credits-badge"
          >
            <Coins size={13} />
            <span>{user.credits} {t.nav.credits}</span>
          </button>

          <button
            type="button"
            onClick={claimWeeklyBonus}
            className="vs-btn vs-btn-secondary vs-btn-sm"
            title="Claim Weekly Visit Bonus Credits"
            id="nav-claim-bonus-btn"
          >
            <Gift size={14} style={{ color: 'var(--accent-amber)' }} />
            <span className="hide-xs">{t.nav.weeklyBonus}</span>
          </button>

          {/* AI Provider Keys Settings */}
          <button
            type="button"
            onClick={() => setSettingsModalOpen(true)}
            className="vs-btn-ghost"
            title={t.studio.apiSettings}
            id="nav-api-settings-btn"
          >
            <KeyRound size={16} />
          </button>

          {/* Language Switcher EN / VI */}
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
            className="vs-btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.84rem', fontWeight: 650 }}
            id="nav-locale-toggle"
          >
            <Globe size={15} />
            <span>{locale === 'en' ? 'EN' : 'VI'}</span>
          </button>

          {/* Auth / Profile */}
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="vs-btn vs-btn-secondary vs-btn-sm"
            id="nav-auth-btn"
          >
            <User size={14} />
            <span>{user.provider === 'demo' ? t.nav.login : user.name}</span>
          </button>

          {!isStudio && (
            <Link href="/studio" className="vs-btn vs-btn-primary vs-btn-sm" id="nav-open-studio-btn">
              <Sparkles size={14} />
              <span>{t.nav.studio}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
