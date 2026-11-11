'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { AI_MODELS, CREATOR_TOOLS } from '@/lib/catalog';
import { useVisionStory } from '@/components/VisionStoryProvider';
import { Footer } from '@/components/Footer';
import { VsIconAiVideo, VsIconFaceSwap, VsIconTools, VsIconViralMusic } from '@/components/Icons';

export default function ToolsDirectoryPage() {
  const { locale } = useVisionStory();
  const [filter, setFilter] = useState<'all' | 'video' | 'image' | 'voice'>('all');

  const visibleTools =
    filter === 'all'
      ? CREATOR_TOOLS
      : CREATOR_TOOLS.filter((t) =>
          filter === 'video' ? t.category === 'video' || t.category === 'avatar' : t.category === filter
        );

  return (
    <main>
      <section className="vs-container" style={{ paddingTop: 44 }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
          <span className="vs-eyebrow">VISIONSTORY CREATIVE SUITE</span>
          <h1 className="vs-h1" style={{ marginBottom: 12 }}>AI Tools</h1>
          <p className="vs-lead">Use VisionStory Tools to level up your creative process</p>
        </div>

        {/* Trending 3-Card Banner matching u08_tools.png */}
        <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 14 }}>Trending</div>
        <div className="vs-grid-3" style={{ marginBottom: 38 }}>
          {[
            {
              title: 'AI Video Generator',
              desc: 'Create AI-generated video clips for your projects.',
              img: '/assets/avatars/olivia.jpg',
              href: '/studio?tab=seedance',
              icon: <VsIconAiVideo />,
            },
            {
              title: 'Music Video',
              desc: 'Turn sound into a visual story.',
              img: '/assets/showcase/music-singer.jpg',
              href: '/studio?tab=viral-music',
              icon: <VsIconViralMusic />,
            },
            {
              title: 'Face Swap',
              desc: 'Instant face replacement for your video clips.',
              img: '/assets/avatars/elena.jpg',
              href: '/studio?tab=face-swap',
              icon: <VsIconFaceSwap />,
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="vs-card vs-card-interactive"
              style={{
                position: 'relative',
                height: 215,
                overflow: 'hidden',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <img
                src={card.img}
                alt={card.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.55,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(10,11,18,0.2) 0%, rgba(10,11,18,0.92) 100%)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '1.12rem', fontWeight: 700, marginBottom: 3 }}>{card.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)' }}>{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Filter Underline Tabs matching u08_tools.png */}
        <div className="vs-underline-tabs" style={{ marginBottom: 22 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'video', label: 'For videos' },
            { id: 'image', label: 'For images' },
            { id: 'voice', label: 'For audio' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`vs-underline-tab ${filter === tab.id ? 'active' : ''}`}
              onClick={() => setFilter(tab.id as typeof filter)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="vs-grid-3" style={{ marginBottom: 64 }}>
          {visibleTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/studio?tab=${tool.studioTab}${tool.studioSubTool ? `&tool=${tool.studioSubTool}` : ''}`}
              className="vs-card vs-card-interactive"
              style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  background: '#191b25',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <VsIconTools />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                    {locale === 'vi' ? tool.titleVi : tool.titleEn}
                  </span>
                  {tool.badge && <span className="vs-tag-duet">{tool.badge}</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {locale === 'vi' ? tool.descVi : tool.descEn}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* AI Models Section */}
        <div id="models" style={{ paddingTop: 24, marginBottom: 64 }}>
          <h2 className="vs-h2" style={{ marginBottom: 20 }}>Supported Video & Image Models</h2>
          <div className="vs-grid-3">
            {AI_MODELS.map((m) => (
              <div key={m.id} className="vs-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span className="vs-tag vs-tag-brand">{m.provider}</span>
                    <span className="vs-tag">{m.resolution}</span>
                  </div>
                  <h3 className="vs-h3" style={{ marginBottom: 8 }}>{m.name}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {locale === 'vi' ? m.summaryVi : m.summaryEn}
                  </p>
                </div>
                <Link href={`/studio?tab=seedance&model=${m.id}`} className="vs-btn vs-btn-secondary vs-btn-sm">
                  <span>Open in Studio</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions & Comparisons */}
        <div id="solutions" style={{ marginBottom: 64 }}>
          <h2 className="vs-h2" style={{ marginBottom: 20 }} id="comparisons">
            Why Creators & Teams Choose VisionStory
          </h2>
          <div className="vs-grid-3">
            {[
              { title: 'V-Character 4.0 Single-Photo Realism', pts: ['No expensive studio shoot required', 'Up to 10-minute consistent identity', 'Natural hand & body motion'] },
              { title: 'Full Multi-Shot AI Video Agent', pts: ['Prompt, URL, or PPTX to finished video', 'Conversational scene-by-scene edits', '16:9, 9:16, and 1:1 exports'] },
              { title: 'Transparent Rollover Credits & OpenAPI', pts: ['Unused monthly credits roll over', 'Free HD Face Swap & Weekly Bonus', 'REST API, Python SDK, CLI & MCP'] },
            ].map((box) => (
              <div key={box.title} className="vs-card" style={{ padding: 24 }}>
                <h3 className="vs-h3" style={{ marginBottom: 12 }}>{box.title}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {box.pts.map((pt) => (
                    <li key={pt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Check size={15} style={{ color: 'var(--accent-brand)' }} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
