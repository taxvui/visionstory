'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Plus,
  Terminal,
  Volume2,
} from 'lucide-react';
import { AI_MODELS, CREATOR_TOOLS, STOCK_AVATARS } from '@/lib/catalog';
import { useVisionStory } from '@/components/VisionStoryProvider';
import { Footer } from '@/components/Footer';
import {
  G2AwardShield,
  G2CircleBadge,
  VsIconAiVideo,
  VsIconFaceSwap,
  VsIconPodcast,
  VsIconTools,
  VsIconViralMusic,
} from '@/components/Icons';

const G2_REVIEWS = [
  {
    initials: 'AG',
    name: 'AKI G.',
    org: 'Small-Business · International Trade and Development',
    title: 'VisionStory AI Delivers Strong ROI with Fast, High-Quality Video Creation',
    body: 'I like VisionStory AI because it delivers strong ROI through intelligent automation, lifelike avatar expressions, and fast multi-language publishing.',
  },
  {
    initials: 'TL',
    name: 'Tony L.',
    org: 'Small-Business · Animation',
    title: 'Natural Lip-Sync & Zero Manual Keyframing',
    body: 'V-Character 4.0 keeps the exact same face identity even on 5-minute explainer scripts. Singing lip sync with Suno tracks is pure magic.',
  },
  {
    initials: 'AM',
    name: 'Aaron Misael G.',
    org: 'Small-Business · Animation',
    title: 'AI Video Agent Replaced Four Separate Tools',
    body: 'Handing the Agent a single brief and getting scenes, voiceover, avatar framing, and burned-in captions in one shot saves us hours every week.',
  },
  {
    initials: 'JH',
    name: 'Jill H.',
    org: 'Small-Business · Entertainment',
    title: 'Podcast & Music Videos in Minutes',
    body: 'We convert our audio episodes directly into two-host studio video podcasts for YouTube and vertical Reels without setting up cameras.',
  },
  {
    initials: 'YD',
    name: 'Yanlong D.',
    org: 'Mid-Market · Computer Software',
    title: 'Clean REST API, Python SDK, and MCP Integration',
    body: 'Our growth engineering pipeline triggers localized product walkthroughs directly via POST /api/v1/video with predictable credit billing.',
  },
  {
    initials: 'LS',
    name: 'liu s.',
    org: 'Small-Business · Legal Services',
    title: 'Crisp 1080p & 2K Client Explainers',
    body: 'Turning FAQ documents and Keynote slides into warm presenter-hosted videos elevated our client onboarding experience overnight.',
  },
];

const HOME_FAQS = [
  {
    q: 'How do I create a video on VisionStory?',
    a: 'Upload a clear front-facing photo or pick from 160+ studio avatars, then type the script you want the avatar to say or upload your own audio. Pick a voice from 1,000+ options in 88 languages, click Generate, and your talking video is ready in minutes.',
  },
  {
    q: 'Is video generation free to try?',
    a: 'Yes! Every new account starts with 10 free sign-up credits plus 4 Weekly Visit Bonus credits so you can test V-Character 4.0 talking videos, Face Swap, and studio tools right away.',
  },
  {
    q: 'How are credits calculated?',
    a: 'Standard V-Character 4.0 talking videos use 1 credit per 4-second interval at 720p (15 credits per minute). Exporting in 1080p adds +0.5×, 2K adds +2.5×, and Green Screen cutout adds +0.25×.',
  },
  {
    q: 'What can the AI Video Agent create?',
    a: 'Give the AI Video Agent a short prompt, URL, PDF, or slide outline. It automatically plans a multi-shot storyboard with script, scene visuals, avatar framing, voiceover, and captions in 16:9, 9:16, or 1:1.',
  },
  {
    q: 'Can I automate VisionStory from my own backend or AI coding agent?',
    a: 'Yes. VisionStory offers a full REST OpenAPI, Python SDK, VisionStory CLI, and MCP Server so coding agents and backend pipelines can discover avatars/voices and render videos programmatically.',
  },
];

export default function MarketingHomePage() {
  const router = useRouter();
  const { locale, showToast } = useVisionStory();
  const [agentPrompt, setAgentPrompt] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('seedance-2.5');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[2];

  const handleHeroAgentSubmit = () => {
    const q = agentPrompt.trim() || 'Create a 30-second product launch video introducing our AI workspace';
    router.push(`/studio?tab=ai-agent&prompt=${encodeURIComponent(q)}`);
  };

  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    showToast(`Copied ${label} to clipboard!`);
  };

  return (
    <main style={{ padding: '0 14px' }}>
      {/* =========================================================
          1. HERO STAGE (Exact 1:1 match to home.png)
          ========================================================= */}
      <section className="vs-hero-stage">
        <div className="vs-hero-bg-media">
          <img src="/assets/avatars/elena.jpg" alt="VisionStory AI Presenter" />
        </div>
        <div className="vs-hero-vignette" />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 820,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2.55rem, 5vw, 4.15rem)',
              fontWeight: 800,
              lineHeight: 1.09,
              letterSpacing: '-0.032em',
              marginBottom: 18,
            }}
          >
            {locale === 'vi' ? (
              <>
                Biến mọi ý tưởng <span className="vs-hero-tint-word">thành</span>
                <br />
                video AI cuốn hút <span className="vs-hero-tint-word">đáng xem</span>
              </>
            ) : (
              <>
                Turn any idea <span className="vs-hero-tint-word">into</span>
                <br />
                an AI video worth <span className="vs-hero-tint-word">watching</span>
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: '1.02rem',
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 670,
              lineHeight: 1.58,
              marginBottom: 28,
            }}
          >
            {locale === 'vi'
              ? 'Nhập câu lệnh, tải ảnh chân dung hoặc đưa slide vào. VisionStory tự động đạo diễn bối cảnh, giọng nói, chuyển động và phụ đề — sẵn sàng xuất bản trong vài phút.'
              : 'Write a prompt, upload a photo, or bring your slides. VisionStory directs the scene, voice, motion, and captions — ready to publish in minutes.'}
          </p>

          <Link
            href="/studio"
            className="vs-btn vs-btn-primary vs-btn-lg"
            style={{ padding: '14px 30px', fontSize: '0.96rem', marginBottom: 34 }}
            id="hero-get-started-btn"
          >
            <span>{locale === 'vi' ? 'Bắt đầu MIỄN PHÍ' : 'Get started FREE'}</span>
            <ArrowRight size={16} />
          </Link>

          {/* G2 4.7/5 + 4 Fall 2026 Hexagonal Award Shields */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <G2CircleBadge />
              <span style={{ color: '#ff6b3d', letterSpacing: 2, fontSize: '0.95rem' }}>★★★★★</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                4.7 / 5 from 535 reviews
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <G2AwardShield title="High Performer" accent="#ff5c35" />
              <G2AwardShield title="Easiest To Use" accent="#f59e0b" />
              <G2AwardShield title="Best Est. ROI" accent="#6366f1" />
              <G2AwardShield title="Fastest Impl." accent="#0ea5e9" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. AI AVATAR GENERATOR (Exact 1:1 Indigo Shell + 2x2 Light Mint Bento)
          ========================================================= */}
      <section className="vs-section-shell vs-section-shell-indigo">
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <span className="vs-eyebrow">AI AVATAR GENERATOR</span>
          <h2 className="vs-h2" style={{ marginBottom: 14 }}>
            {locale === 'vi'
              ? 'Nhân vật AI chân thực nhất trong thế giới AI Video'
              : 'The most lifelike AI avatars in AI video'}
          </h2>
          <p className="vs-lead" style={{ fontSize: '0.98rem' }}>
            Character consistency is what separates a useful avatar from a gimmick. V-Character delivers it across every angle, every expression, and every video you create.
          </p>
        </div>

        <div className="vs-grid-2" style={{ marginBottom: 34 }}>
          {/* Card 1 */}
          <div className="vs-light-bento-card">
            <div className="vs-light-bento-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <img src="/assets/avatars/claire.jpg" alt="Angle 1" style={{ width: 62, height: 62, borderRadius: 12, objectFit: 'cover', border: '2px solid #fff' }} />
                <img src="/assets/avatars/aria.jpg" alt="Angle 2" style={{ width: 62, height: 62, borderRadius: 12, objectFit: 'cover', border: '2px solid #fff', marginLeft: 18 }} />
              </div>
              <img
                src="/assets/avatars/claire.jpg"
                alt="V-Character 4.0"
                style={{ width: 190, height: 190, borderRadius: 18, objectFit: 'cover', boxShadow: '0 14px 30px rgba(30,41,59,0.2)' }}
              />
            </div>
            <div style={{ padding: '4px 6px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                V-Character 4.0: More Realistic AI Avatars
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, marginBottom: 12 }}>
                The latest V-Character model renders sharper faces, subtler expressions, and natural hand and body movement for lifelike talking videos.
              </p>
              <Link href="/studio?tab=ai-video" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#4f46e5' }}>
                Explore AI Avatar →
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="vs-light-bento-card">
            <div className="vs-light-bento-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 }}>
              {STOCK_AVATARS.slice(0, 4).map((av, i) => (
                <img
                  key={av.id}
                  src={av.image}
                  alt={av.name}
                  style={{
                    width: i === 1 ? 150 : 82,
                    height: i === 1 ? 176 : 136,
                    borderRadius: 14,
                    objectFit: 'cover',
                    border: '2px solid #ffffff',
                    boxShadow: '0 10px 24px rgba(15,23,42,0.16)',
                  }}
                />
              ))}
            </div>
            <div style={{ padding: '4px 6px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                Consistent AI Characters for Long Videos
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, marginBottom: 12 }}>
                Create AI avatar videos up to 10 minutes long while keeping your character&apos;s appearance and identity consistent in every scene.
              </p>
              <Link href="/studio?tab=ai-video" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#4f46e5' }}>
                Explore AI Video →
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="vs-light-bento-card">
            <div className="vs-light-bento-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, maxWidth: 220 }}>
                {['🇺🇸 ENGLISH', '🇩🇪 DEUTSCH', '🇫🇷 FRANÇAIS', '🇪🇸 ESPAÑOL', '🇻🇳 TIẾNG VIỆT', '🇯🇵 日本語', '🇰🇷 한국어'].map((lang, idx) => (
                  <span
                    key={lang}
                    style={{
                      padding: idx === 0 ? '7px 14px' : '5px 10px',
                      borderRadius: 999,
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: idx === 0 ? '0.82rem' : '0.7rem',
                      fontWeight: 800,
                      boxShadow: '0 6px 16px rgba(15,23,42,0.1)',
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <img
                src="/assets/avatars/marcus.jpg"
                alt="Multilingual AI Voices"
                style={{ width: 155, height: 185, borderRadius: 16, objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '4px 6px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                Multilingual AI Voices for Global Audiences
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, marginBottom: 12 }}>
                Choose from 1,000+ natural AI voices across 88 languages, countries, and regional accents — or clone your own voice.
              </p>
              <Link href="/studio?tab=ai-tools&tool=tts" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#4f46e5' }}>
                Explore AI Voices →
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="vs-light-bento-card">
            <div className="vs-light-bento-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: 16 }}>
              <img
                src="/assets/avatars/kenji.jpg"
                alt="High-Resolution 2K"
                style={{ width: 175, height: 185, borderRadius: 16, objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['720p Standard', '1080p Full HD', '2K Ultra Sharp'].map((res, i) => (
                  <div
                    key={res}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      background: i === 2 ? '#4f46e5' : '#ffffff',
                      color: i === 2 ? '#ffffff' : '#0f172a',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      boxShadow: '0 6px 14px rgba(15,23,42,0.08)',
                    }}
                  >
                    {res}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '4px 6px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                High-Resolution up to 2K
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, marginBottom: 12 }}>
                Export professional AI avatar videos in 720p, 1080p, or crisp 2K resolution for marketing, training, and social media.
              </p>
              <Link href="/studio?tab=ai-video" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#4f46e5' }}>
                Explore HD Video →
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Realism that scales</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              One consistent character — every language, length, and resolution.
            </div>
          </div>
          <Link href="/studio?tab=ai-video" className="vs-btn vs-btn-primary" style={{ paddingRight: 10 }}>
            <span>Create Your AI Video</span>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#ffffff',
                color: '#0f172a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 6,
              }}
            >
              <ArrowUpRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      {/* =========================================================
          3. AI VIDEO AGENT (Exact 1:1 Slate Shell + Interactive Composer Overlay)
          ========================================================= */}
      <section className="vs-section-shell vs-section-shell-slate">
        <div style={{ maxWidth: 680, marginBottom: 36 }}>
          <span className="vs-eyebrow">FROM BRIEF TO PUBLISHED VIDEO</span>
          <h2 className="vs-h2" style={{ marginBottom: 14 }}>
            AI Video Agent: From a Prompt
            <br />
            to a Ready-to-Publish Video
          </h2>
          <p className="vs-lead" style={{ fontSize: '0.96rem' }}>
            Pick an AI avatar and describe your video in a sentence — or hand the agent a URL, PDF, or deck. It plans a multi-shot talking video for you: script, a scene for every shot, voiceover, and captions. Then refine any shot just by chatting, and generate in 16:9, 9:16, or 1:1.
          </p>
        </div>

        {/* Visual Stage + Interactive Floating Agent Bar */}
        <div
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)',
            minHeight: 430,
            background: 'radial-gradient(circle at 50% 30%, #2e2a72 0%, #0d0f1a 70%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: 28,
            marginBottom: 22,
          }}
        >
          <img
            src="/assets/avatars/elena.jpg"
            alt="AI Video Agent Director"
            style={{
              position: 'absolute',
              top: 0,
              width: 390,
              height: 390,
              objectFit: 'cover',
              borderRadius: '0 0 28px 28px',
              opacity: 0.92,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: 620,
              background: 'rgba(18, 19, 27, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 18,
              padding: 16,
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span className="vs-ctrl-pill" style={{ height: 32 }}>
                <img src="/assets/avatars/aria.jpg" alt="Avatar" style={{ width: 20, height: 20, borderRadius: 5, objectFit: 'cover' }} />
                <span>Avatar</span>
              </span>
              <span className="vs-ctrl-pill" style={{ height: 32 }}>
                <Volume2 size={14} style={{ color: '#38bdf8' }} />
                <span>Auto Voice</span>
              </span>
            </div>
            <input
              type="text"
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleHeroAgentSubmit()}
              placeholder="Describe your scene, message, or story..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.92rem',
                padding: '6px 0 14px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="vs-ctrl-pill" style={{ width: 32, height: 32, padding: 0, justifyContent: 'center' }}>
                  <Plus size={15} />
                </span>
                <span className="vs-ctrl-pill" style={{ height: 32 }}>16:9 · 9:16</span>
              </div>
              <button type="button" className="vs-circle-submit" onClick={handleHeroAgentSubmit} title="Launch AI Agent">
                <ArrowUp size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Light Summary Card below matching marketing_home_tall.png */}
        <div className="vs-light-bento-card" style={{ padding: '28px 32px' }}>
          <div>
            <div style={{ fontSize: '0.73rem', fontWeight: 800, letterSpacing: '0.08em', color: '#4f46e5', marginBottom: 8 }}>
              AGENT VS. POINT TOOLS
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
              One AI video generator for the full production cycle
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#475569', maxWidth: 760 }}>
              Most AI tools only handle one step: scriptwriting, avatars, image generation, voiceover, captions, or editing. VisionStory AI Agent connects the entire workflow, so business teams ship finished videos faster.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. AI MUSIC VIDEO, PODCAST & FACE SWAP SHOWCASE
          ========================================================= */}
      <section className="vs-container" style={{ margin: '56px auto' }}>
        <div className="vs-grid-3">
          {/* Music Video */}
          <div className="vs-card vs-card-interactive" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18 }}>
            <div>
              <span className="vs-eyebrow">FROM PHOTO TO MUSIC VIDEO</span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 10 }}>AI Music Video Generator</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Turn one song and one photo into a cinematic AI music video with natural singing lip sync — Solo or Duet. Works with MP3, WAV, Suno, or Udio.
              </p>
              <img
                src="/assets/showcase/music-singer.jpg"
                alt="AI Music Video"
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 14 }}
              />
            </div>
            <Link href="/studio?tab=viral-music" className="vs-btn vs-btn-primary" style={{ width: '100%' }}>
              <VsIconViralMusic />
              <span>Create Viral Music Video</span>
            </Link>
          </div>

          {/* Podcast Video */}
          <div className="vs-card vs-card-interactive" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18 }}>
            <div>
              <span className="vs-eyebrow">TURN AUDIO INTO PODCAST VIDEO</span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 10 }}>AI Podcast Video Generator</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Upload NotebookLM audio, MP3s, or a topic prompt — VisionStory puts two lifelike AI hosts in a broadcast podcast studio automatically.
              </p>
              <img
                src="/assets/showcase/podcast-mindful.jpg"
                alt="AI Video Podcast"
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 14 }}
              />
            </div>
            <Link href="/studio?tab=podcast" className="vs-btn vs-btn-primary" style={{ width: '100%' }}>
              <VsIconPodcast />
              <span>Open Podcast Studio</span>
            </Link>
          </div>

          {/* Face Swap */}
          <div className="vs-card vs-card-interactive" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18 }}>
            <div>
              <span className="vs-eyebrow">SWAP FACES IN SECONDS</span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 10 }}>AI Video Face Swap</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Upload a reference face and target clip to generate a realistic HD face swap that tracks expression, head motion, and studio lighting.
              </p>
              <img
                src="/assets/avatars/nina.jpg"
                alt="AI Video Face Swap"
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 14 }}
              />
            </div>
            <Link href="/studio?tab=face-swap" className="vs-btn vs-btn-primary" style={{ width: '100%' }}>
              <VsIconFaceSwap />
              <span>Try Free Face Swap</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. SEEDANCE 2.5 & VIDEO MODELS HUB
          ========================================================= */}
      <section className="vs-section-shell vs-section-shell-slate">
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 30px' }}>
          <span className="vs-eyebrow">VIDEO MODELS</span>
          <h2 className="vs-h2" style={{ marginBottom: 12 }}>
            Try Seedance 2.5 and More AI Video Models
          </h2>
          <p className="vs-lead" style={{ fontSize: '0.95rem' }}>
            Create high-quality Seedance 2.5 AI videos online with VisionStory. Turn text prompts, images, audio, video, and up to 50 references into controlled clips for ads and storytelling.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {AI_MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedModelId(m.id)}
              className={`vs-btn vs-btn-sm ${selectedModelId === m.id ? 'vs-btn-primary' : 'vs-btn-secondary'}`}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="vs-card" style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 28, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span className="vs-tag vs-tag-brand">{selectedModel.provider}</span>
              <span className="vs-tag">{selectedModel.resolution}</span>
              <span className="vs-tag">{selectedModel.maxDuration}</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 10 }}>{selectedModel.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 18 }}>
              {locale === 'vi' ? selectedModel.summaryVi : selectedModel.summaryEn}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
              {selectedModel.capabilities.map((cap) => (
                <span key={cap} className="vs-tag" style={{ color: '#fff' }}>
                  <Check size={12} style={{ color: 'var(--accent-brand)' }} /> {cap}
                </span>
              ))}
            </div>
            <Link href={`/studio?tab=seedance&model=${selectedModel.id}`} className="vs-btn vs-btn-primary">
              <span>Generate with {selectedModel.name}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
          <img
            src={selectedModel.showcaseImage}
            alt={selectedModel.name}
            style={{ width: '100%', height: 290, objectFit: 'cover', borderRadius: 16 }}
          />
        </div>
      </section>

      {/* =========================================================
          6. AGENT READY: CLI & MCP DEVELOPER WORKFLOW
          ========================================================= */}
      <section className="vs-container" style={{ margin: '64px auto' }}>
        <div className="vs-card" style={{ padding: '44px 40px', background: '#0b0c12' }}>
          <div className="vs-grid-2" style={{ alignItems: 'center', gap: 36 }}>
            <div>
              <span className="vs-eyebrow">AGENT READY</span>
              <h2 className="vs-h2" style={{ marginBottom: 14 }}>
                Works where your agents work.
              </h2>
              <p className="vs-lead" style={{ fontSize: '0.95rem', marginBottom: 22 }}>
                Copy one setup message for your coding agent, or connect the MCP server and VisionStory CLI to expose talking-video generation as a reusable tool.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Link href="/openapi" className="vs-btn vs-btn-primary">
                  <Terminal size={16} />
                  <span>Explore OpenAPI & MCP</span>
                </Link>
                <Link href="/studio?tab=api" className="vs-btn vs-btn-secondary">
                  <span>Create API Key</span>
                </Link>
              </div>
            </div>

            <div style={{ background: '#050609', border: '1px solid var(--border-hairline)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#a59eff', letterSpacing: '0.06em' }}>
                  VISIONSTORY CLI · ISOLATED INSTALLER
                </span>
                <button
                  type="button"
                  className="vs-tag"
                  onClick={() => copyText('curl -LsSf https://www.visionstory.ai/cli/install.sh | sh', 'CLI command')}
                >
                  <Copy size={12} /> Copy
                </button>
              </div>
              <pre
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.82rem',
                  color: '#e2e8f0',
                  overflowX: 'auto',
                  lineHeight: 1.65,
                }}
              >
{`$ curl -LsSf https://www.visionstory.ai/cli/install.sh | sh
$ export VISIONSTORY_API_KEY="vs_live_..."
$ visionstory video create \\
    --avatar av_aria_v4 \\
    --voice voice_alloy \\
    --resolution 1080p \\
    --script "Ship talking videos straight from CI!"`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. VISIONSTORY AI TOOLS FOR EVERY CREATOR
          ========================================================= */}
      <section className="vs-container" style={{ margin: '64px auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 34px' }}>
          <span className="vs-eyebrow">VISIONSTORY TOOLS</span>
          <h2 className="vs-h2" style={{ marginBottom: 10 }}>AI Tools for Every Creator</h2>
          <p className="vs-lead" style={{ fontSize: '0.94rem' }}>
            Find the right VisionStory tool for videos, avatars, voices, images, presentations, and creative workflows.
          </p>
        </div>

        <div className="vs-grid-3">
          {CREATOR_TOOLS.slice(0, 9).map((tool) => (
            <Link
              key={tool.slug}
              href={`/studio?tab=${tool.studioTab}${tool.studioSubTool ? `&tool=${tool.studioSubTool}` : ''}`}
              className="vs-card vs-card-interactive"
              style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 15 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  background: '#191b26',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {tool.category === 'avatar' ? <VsIconAiVideo /> : <VsIconTools />}
              </div>
              <div style={{ minWidth: 0 }}>
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
      </section>

      {/* =========================================================
          8. USERS LOVE VISIONSTORY (Verified G2 Reviews)
          ========================================================= */}
      <section className="vs-container" style={{ margin: '72px auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
          <span className="vs-eyebrow">9 G2 AWARDS · FALL 2026</span>
          <h2 className="vs-h2" style={{ marginBottom: 10 }}>Users Love VisionStory</h2>
          <p className="vs-lead" style={{ fontSize: '0.94rem' }}>
            Real reviews from verified G2 users — creators, marketers, and teams who ship videos with VisionStory.
          </p>
        </div>

        <div className="vs-grid-3">
          {G2_REVIEWS.map((rev) => (
            <div key={rev.name} className="vs-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ color: '#ff6b3d', fontSize: '0.9rem', letterSpacing: 2, marginBottom: 8 }}>★★★★★</div>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: 8 }}>{rev.title}</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{rev.body}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border-hairline)' }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'var(--accent-brand-soft)',
                    color: '#b7b2ff',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {rev.initials}
                </span>
                <div>
                  <div style={{ fontSize: '0.83rem', fontWeight: 700 }}>{rev.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rev.org}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          9. FAQ & FINAL CTA BANNER
          ========================================================= */}
      <section className="vs-container" style={{ maxWidth: 860, margin: '72px auto' }}>
        <h2 className="vs-h2" style={{ textAlign: 'center', marginBottom: 28 }}>
          Frequently asked questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HOME_FAQS.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <div key={item.q} className="vs-card" style={{ overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 650,
                    fontSize: '0.96rem',
                    textAlign: 'left',
                  }}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={17}
                    style={{
                      transform: open ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.15s ease',
                      opacity: 0.7,
                    }}
                  />
                </button>
                {open && (
                  <div style={{ padding: '0 22px 18px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="vs-section-shell vs-section-shell-indigo" style={{ textAlign: 'center', padding: '64px 28px' }}>
        <h2 className="vs-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: 14 }}>
          One Platform for Every Video You Make
        </h2>
        <p className="vs-lead" style={{ maxWidth: 620, margin: '0 auto 26px' }}>
          AI avatars, a video agent, music videos, podcasts, and face swap — start free with 160+ ready-made characters.
        </p>
        <Link href="/studio" className="vs-btn vs-btn-primary vs-btn-lg">
          <span>TRY IT FREE</span>
          <ArrowRight size={16} />
        </Link>
      </section>

      <Footer />
    </main>
  );
}
