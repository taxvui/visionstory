'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { AI_MODELS, CREATOR_TOOLS } from '@/lib/catalog';
import { useVisionStory } from '@/components/VisionStoryProvider';
import { Footer } from '@/components/Footer';

export default function ToolsDirectoryPage() {
  const { locale } = useVisionStory();
  const [filter, setFilter] = useState<'all' | 'avatar' | 'video' | 'voice' | 'image'>('all');

  const filteredTools = CREATOR_TOOLS.filter((t) => filter === 'all' || t.category === filter);

  return (
    <main>
      {/* 1. ALL CREATOR AI TOOLS */}
      <section className="vs-section" style={{ paddingTop: 64 }}>
        <div className="vs-container">
          <div style={{ maxWidth: 760, marginBottom: 30 }}>
            <span className="vs-eyebrow">All VisionStory Tools</span>
            <h1 className="vs-h1" style={{ fontSize: 'clamp(2.1rem, 4vw, 3.3rem)', marginBottom: 12 }}>
              {locale === 'vi'
                ? 'Trọn Bộ Công Cụ Sáng Tạo AI Trong Một Nền Tảng'
                : 'Every AI Video, Avatar, Voice & Image Tool in One Suite'}
            </h1>
            <p className="vs-lead">
              Click any workflow below to open it directly inside VisionStory Studio.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {[
              { id: 'all', label: 'All Workflows (14)' },
              { id: 'avatar', label: 'Talking Avatars & UGC' },
              { id: 'video', label: 'AI Video, Podcast & Slides' },
              { id: 'voice', label: 'Voice Clone & Speech' },
              { id: 'image', label: 'AI Image, Cutout & Upscale' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id as typeof filter)}
                className={filter === cat.id ? 'vs-btn vs-btn-primary vs-btn-sm' : 'vs-btn vs-btn-secondary vs-btn-sm'}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="vs-grid-3">
            {filteredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/studio?tab=${tool.studioTab}${tool.studioSubTool ? `&tool=${tool.studioSubTool}` : ''}`}
                className="vs-card vs-card-interactive"
                style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="vs-tag vs-tag-brand">{tool.badge}</span>
                  <ArrowRight size={15} style={{ color: 'var(--text-muted)' }} />
                </div>
                <h2 className="vs-h3">{locale === 'vi' ? tool.titleVi : tool.titleEn}</h2>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', flex: 1 }}>
                  {locale === 'vi' ? tool.descVi : tool.descEn}
                </p>
                <span style={{ fontSize: '0.84rem', fontWeight: 650, color: 'var(--accent-brand)' }}>
                  Open in Studio →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. AI MODELS CATALOG */}
      <section id="models" className="vs-section">
        <div className="vs-container">
          <span className="vs-eyebrow">AI Landscape</span>
          <h2 className="vs-h2" style={{ marginBottom: 24 }}>Supported AI Video, Avatar & Image Models</h2>
          <div className="vs-grid-3">
            {AI_MODELS.map((m) => (
              <div key={m.id} className="vs-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={m.showcaseImage} alt={m.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="vs-h3">{m.name}</h3>
                    <span className="vs-tag">{m.provider}</span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', flex: 1 }}>
                    {locale === 'vi' ? m.summaryVi : m.summaryEn}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {m.capabilities.map((cap) => (
                      <span key={cap} className="vs-tag" style={{ fontSize: '0.71rem' }}>{cap}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS BY TEAM */}
      <section id="solutions" className="vs-section">
        <div className="vs-container">
          <span className="vs-eyebrow">Solutions</span>
          <h2 className="vs-h2" style={{ marginBottom: 24 }}>Built for Growth, Enablement & Media Teams</h2>
          <div className="vs-grid-3">
            {[
              ['Marketing & UGC Ads', 'Paste product URLs to spin up creator hooks in 88 languages for TikTok, Reels & Meta Ads.'],
              ['Learning & Development', 'Convert onboarding slides into consistent presenter-hosted lessons with zero filming.'],
              ['Sales Outreach', 'Send personalized founder or AE avatar introductions via REST API at scale.'],
              ['Podcasters & Creators', 'Turn audio episodes or NotebookLM exports into engaging two-host video shows.'],
              ['Agencies', 'Deliver multi-market localized client campaigns with rollover credits and 2K green-screen assets.'],
              ['Creator Monetization', 'Design one reusable virtual AI influencer face & voice for daily social publishing.'],
            ].map(([title, desc]) => (
              <div key={title} className="vs-card" style={{ padding: 22 }}>
                <h3 className="vs-h3" style={{ marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPETITOR COMPARISONS */}
      <section id="comparisons" className="vs-section">
        <div className="vs-container">
          <span className="vs-eyebrow">Transparent Benchmarks</span>
          <h2 className="vs-h2" style={{ marginBottom: 20 }}>
            VisionStory vs HeyGen, Synthesia, D-ID & Vidnoz
          </h2>
          <div className="vs-table-wrap">
            <table className="vs-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th style={{ color: 'var(--accent-teal)' }}>VisionStory AI</th>
                  <th>HeyGen</th>
                  <th>Synthesia</th>
                  <th>D-ID</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Entry Paid Plan', '$9.99 / mo', '$29 / mo', '$29 / mo', '$18 / mo'],
                  ['Single-Photo Talking Avatar', '✓ V-Character 4.0', '✓ Supported', 'Limited', '✓ Supported'],
                  ['2-Speaker Audio Podcast Split', '✓ Built-in (NotebookLM)', '—', '—', '—'],
                  ['AI Music Video Singing Lip-Sync', '✓ Suno / Udio / MP3', '—', '—', '—'],
                  ['Frontier Models (Seedance, Kling, Wan)', '✓ Integrated in Studio', 'Separate', '—', '—'],
                  ['Unused Credit Rollover', '✓ Up to 2× monthly cap', 'Plan dependent', '—', '—'],
                  ['CLI + MCP + Agent Skill', '✓ Native support', 'API / MCP', 'API only', 'API only'],
                ].map(([cap, vs, hg, syn, did]) => (
                  <tr key={cap}>
                    <td style={{ fontWeight: 600 }}>{cap}</td>
                    <td style={{ color: 'var(--accent-teal)', fontWeight: 650 }}>
                      <Check size={14} style={{ display: 'inline', marginRight: 5 }} />
                      {vs}
                    </td>
                    <td>{hg}</td>
                    <td>{syn}</td>
                    <td>{did}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. TUTORIALS */}
      <section id="tutorials" className="vs-section" style={{ borderBottom: 'none' }}>
        <div className="vs-container">
          <span className="vs-eyebrow">Tutorials & How-To Guides</span>
          <h2 className="vs-h2" style={{ marginBottom: 24 }}>Master VisionStory in Minutes</h2>
          <div className="vs-grid-3">
            {[
              ['How to Make Any Photo Talk in 60 Seconds', 'Upload a clear portrait, pick one of 1,000+ voices, adjust emotion, and export in 1080p.', '/studio?tab=ai-video'],
              ['Turn a Google NotebookLM Audio Podcast into Video', 'Import your two-speaker MP3 or paste a dialogue script to animate dual studio hosts.', '/studio?tab=podcast'],
              ['Automate Personalized Videos with CLI & Claude Code', 'Install the VisionStory CLI, create a server key, and batch-render videos from JSON.', '/openapi'],
            ].map(([title, desc, href]) => (
              <Link key={title} href={href} className="vs-card vs-card-interactive" style={{ padding: 24 }}>
                <h3 className="vs-h3" style={{ marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', marginBottom: 14 }}>{desc}</p>
                <span style={{ color: 'var(--accent-brand)', fontWeight: 650, fontSize: '0.86rem' }}>
                  Try Workflow →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
