'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  ChevronDown,
  Copy,
  Mic,
  Music,
  Play,
  Sparkles,
  Star,
  Terminal,
  Upload,
  Volume2,
  Wand2,
} from 'lucide-react';
import { useVisionStory } from '@/components/VisionStoryProvider';
import { Footer } from '@/components/Footer';
import { AI_MODELS } from '@/lib/catalog';
import { speakScript } from '@/lib/audioEngine';

const AGENT_SETUP_PROMPTS: Record<string, string> = {
  'Claude Code': `Help me set up VisionStory and generate a talking-avatar video.
1. Install or update the CLI and Agent Skill:
   curl -fsSL https://developers.visionstory.ai/cli | bash
   npx skills add visionstory-ai/skills --skill visionstory-api
2. Run visionstory doctor. Verify access with visionstory credits.
3. Discover current models, avatars, and voices via GET /api/v1/models, /api/v1/avatars, and /api/v1/voices.
4. Submit POST /api/v1/video and download the completed MP4.`,
  Cursor: `Configure VisionStory MCP & CLI in Cursor workspace:
1. Run: curl -fsSL https://developers.visionstory.ai/cli | bash
2. Set VISIONSTORY_API_KEY in local secret env and test GET /api/v1/credits.
3. Generate a talking-avatar explainer using model vs_character_v4.`,
  Codex: `Use VisionStory REST API (/api/v1/video) with X-API-Key from environment.
Fetch live avatar_id and voice_id first, submit text_script, poll status until created, and save result.mp4.`,
  Windsurf: `Add VisionStory Agent Skill (npx skills add visionstory-ai/skills --skill visionstory-api), verify credits, and automate multi-language talking product demos.`,
  Cline: `Connect VisionStory MCP server toolset so Cline can list avatars, synthesize multilingual speech, and render 1080p talking presenter clips.`,
  Gemini: `Install VisionStory CLI, verify credits with visionstory credits, then orchestrate V-Character 4.0 and Nano Banana 2 assets into a finished video.`,
};

const HOME_FAQS = [
  {
    qEn: 'How do I create a video on VisionStory?',
    aEn: 'Upload a clear front-facing photo (or choose from 160+ stock avatars), then type the script you want the avatar to say or upload your own audio. Pick a voice from 1,000+ options across 88 languages, click Generate, and your talking video is ready in minutes.',
    qVi: 'Làm thế nào để tạo video trên VisionStory?',
    aVi: 'Tải lên một bức ảnh chân dung nhìn thẳng (hoặc chọn từ 160+ avatar có sẵn), nhập kịch bản hoặc tải lên file ghi âm. Chọn giọng đọc từ hơn 1.000 giọng thuộc 88 ngôn ngữ, nhấn Tạo Video và nhận thành phẩm ngay.',
  },
  {
    qEn: 'Is video generation free to try?',
    aEn: 'Eligible new accounts receive 10 free sign-up credits, plus a Weekly Visit Bonus (4 credits on Free, 8 on Pro, 20 on Advanced, and 60 on Ultra). Video & Photo Face Swap is completely free with HD output and no watermark.',
    qVi: 'Tôi có được dùng thử tạo video miễn phí không?',
    aVi: 'Tài khoản mới nhận ngay 10 sign-up credits miễn phí kèm Thưởng ghé thăm hàng tuần (4 credits gói Free, 8 gói Pro, 20 gói Advanced và 60 gói Ultra). Riêng tính năng Face Swap hoàn toàn miễn phí xuất HD không watermark.',
  },
  {
    qEn: 'How are credits calculated?',
    aEn: 'V-Character 4.0 talking video costs 1 credit per 4-second interval at 720p, with partial intervals rounded up. 1080p adds 0.5× base credits, 2K adds 2.5× base credits, and Green Screen adds 0.25× base credits, each rounded up separately.',
    qVi: 'Credits được tính như thế nào?',
    aVi: 'Video nói chuyện V-Character 4.0 tốn 1 credit cho mỗi khoảng 4 giây ở 720p (làm tròn lên). Xuất 1080p cộng thêm 0.5×, 2K cộng 2.5× và Phông xanh Green Screen cộng 0.25× số credit cơ bản.',
  },
  {
    qEn: 'What languages and voices are supported?',
    aEn: 'VisionStory supports 88 languages with 1,000+ natural voices — including English, Vietnamese, Spanish, Chinese, Japanese, German, French, Portuguese, and Arabic — plus instant personal Voice Cloning.',
    qVi: 'VisionStory hỗ trợ những ngôn ngữ và giọng đọc nào?',
    aVi: 'Hỗ trợ 88 ngôn ngữ với hơn 1.000 giọng tự nhiên bao gồm Tiếng Việt, Tiếng Anh, Nhật, Hàn, Trung, Pháp, Đức, Tây Ban Nha… cùng tính năng nhân bản giọng nói cá nhân (Voice Clone).',
  },
  {
    qEn: 'How long can my videos be?',
    aEn: 'Free accounts can generate videos up to 30 seconds. Paid plans extend single-video length up to 10 minutes with consistent character appearance.',
    qVi: 'Video của tôi có thể dài tối đa bao lâu?',
    aVi: 'Tài khoản miễn phí hỗ trợ tối đa 30 giây/video. Các gói trả phí mở rộng thời lượng lên tới 10 phút liên tục mà vẫn giữ nguyên diện mạo nhân vật.',
  },
  {
    qEn: 'Do I need to record a video to create an avatar?',
    aEn: 'No. A single clear front-facing photo is enough — V-Character 4.0 animates it into a talking presenter with natural facial expressions, lip-sync, and hand movement.',
    qVi: 'Tôi có cần quay video mẫu để tạo avatar không?',
    aVi: 'Không cần. Chỉ một bức ảnh chân dung rõ nét là đủ để V-Character 4.0 tái tạo cử động khuôn mặt, nhép môi và cử chỉ tay sống động.',
  },
  {
    qEn: 'Which video models does VisionStory offer?',
    aEn: 'V-Character 4.0 is our native talking-avatar model. For cinematic B-roll and commercial scenes, VisionStory also runs Seedance 2.5, Kling O3, MiniMax H3, Wan 3.0, and Nano Banana 2 inside the same Studio.',
    qVi: 'VisionStory tích hợp những mô hình AI nào?',
    aVi: 'Bên cạnh mô hình gốc V-Character 4.0 chuyên trị MC nói chuyện, VisionStory tích hợp trực tiếp Seedance 2.5, Kling O3, MiniMax H3, Wan 3.0 và Nano Banana 2 ngay trong cùng một Studio.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { locale, t, avatars, voices, showToast } = useVisionStory();

  const [heroPrompt, setHeroPrompt] = useState(
    'Introduce our AI-powered analytics workspace in 20 seconds with an energetic, trustworthy product demo tone.'
  );
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatars[0]?.id || 'av_aria_v4');
  const [selectedVoiceId, setSelectedVoiceId] = useState('voice_alloy');
  const [faceSwapTab, setFaceSwapTab] = useState<'video' | 'photo'>('video');
  const [seedanceMode, setSeedanceMode] = useState('Text To Video');
  const [seedancePrompt, setSeedancePrompt] = useState(
    'Sleek silver electric coupe gliding through rain-lit Tokyo neon streets at dusk, anamorphic cinema lens'
  );
  const [codingAgent, setCodingAgent] = useState('Claude Code');
  const [agentProtocol, setAgentProtocol] = useState<'skill' | 'mcp'>('skill');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const launchHeroStudio = () => {
    const params = new URLSearchParams({
      tab: 'ai-video',
      avatar: selectedAvatarId,
      voice: selectedVoiceId,
      prompt: heroPrompt,
    });
    router.push(`/studio?${params.toString()}`);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(locale === 'vi' ? `Đã sao chép ${label}!` : `Copied ${label} to clipboard!`);
  };

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="vs-section" style={{ paddingTop: 72, paddingBottom: 80 }}>
        <div className="vs-container">
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <h1 className="vs-h1" style={{ marginBottom: 20 }}>
              {t.hero.titleLine1}
              <br />
              {t.hero.titleLine2}
            </h1>
            <p className="vs-lead" style={{ margin: '0 auto 30px' }}>
              {t.hero.subtitle}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 38 }}>
              <Link href="/studio" className="vs-btn vs-btn-primary vs-btn-lg" id="hero-cta-primary">
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/openapi" className="vs-btn vs-btn-secondary vs-btn-lg" id="hero-cta-api">
                <Terminal size={17} />
                <span>{t.hero.ctaSecondary}</span>
              </Link>
            </div>
          </div>

          {/* Interactive Hero Studio Composer Box */}
          <div
            className="vs-card"
            style={{
              maxWidth: 960,
              margin: '0 auto 34px',
              padding: 22,
              background: 'linear-gradient(180deg, hsla(222,18%,13%,0.95), hsla(222,20%,8.5%,0.98))',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                {avatars.slice(0, 6).map((av) => {
                  const active = av.id === selectedAvatarId;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarId(av.id);
                        setSelectedVoiceId(av.defaultVoiceId);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '5px 11px 5px 5px',
                        borderRadius: 999,
                        background: active ? 'var(--accent-brand-soft)' : 'var(--bg-elevated)',
                        border: `1px solid ${active ? 'var(--accent-brand)' : 'var(--border-hairline)'}`,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      <img
                        src={av.image}
                        alt={av.name}
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>{av.name}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select
                  aria-label="Select voice"
                  className="vs-select"
                  style={{ width: 'auto', padding: '7px 12px', fontSize: '0.83rem' }}
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      🎙 {v.name} · {v.language}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="vs-btn vs-btn-secondary vs-btn-sm"
                  onClick={() => {
                    const chosen = voices.find((v) => v.id === selectedVoiceId) || voices[0];
                    speakScript({ text: heroPrompt || chosen.sampleText, voice: chosen });
                  }}
                >
                  <Volume2 size={14} />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            <textarea
              className="vs-textarea"
              style={{ minHeight: 88, marginBottom: 14 }}
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              placeholder={t.hero.promptPlaceholder}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="vs-tag">V-Character 4.0</span>
                <span className="vs-tag">720p · 1080p · 2K</span>
                <span className="vs-tag">16:9 · 9:16 · 1:1</span>
                <span className="vs-tag">88 Languages</span>
              </div>
              <button
                type="button"
                onClick={launchHeroStudio}
                className="vs-btn vs-btn-primary"
                id="hero-quick-launch-btn"
              >
                <Sparkles size={16} />
                <span>{t.hero.quickLaunch}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* G2 Awards & Social Proof Strip */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 14,
              color: 'var(--text-secondary)',
              fontSize: '0.84rem',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--text-primary)' }}>
              <Star size={15} fill="#f59e0b" color="#f59e0b" />
              {t.hero.g2Score}
            </span>
            <span>·</span>
            <span className="vs-tag"><Award size={13} /> High Performer · Fall 2026</span>
            <span className="vs-tag"><Award size={13} /> Easiest To Use</span>
            <span className="vs-tag"><Award size={13} /> Best Estimated ROI</span>
            <span className="vs-tag"><Award size={13} /> Fastest Implementation</span>
          </div>
        </div>
      </section>

      {/* 2. V-CHARACTER 4.0 LIFELIKE AI AVATARS */}
      <section className="vs-section">
        <div className="vs-container">
          <div style={{ marginBottom: 42 }}>
            <span className="vs-eyebrow">{t.sections.avatarEyebrow}</span>
            <h2 className="vs-h2" style={{ marginBottom: 12 }}>{t.sections.avatarTitle}</h2>
            <p className="vs-lead">{t.sections.avatarDesc}</p>
          </div>

          <div className="vs-grid-2">
            {[
              {
                img: '/assets/avatars/aria.jpg',
                badge: 'V-Character 4.0',
                title: locale === 'vi' ? 'V-Character 4.0: AI Avatar Chân Thực Vượt Trội' : 'V-Character 4.0: More Realistic AI Avatars',
                desc:
                  locale === 'vi'
                    ? 'Mô hình V-Character mới nhất tái tạo gương mặt sắc nét, biểu cảm tinh tế cùng chuyển động tay và cơ thể tự nhiên chỉ từ một bức ảnh.'
                    : 'The latest V-Character model renders sharper faces, subtler expressions, and natural hand and body movement for lifelike talking videos.',
                cta: 'Explore AI Avatar →',
                href: '/studio?tab=ai-video',
              },
              {
                img: '/assets/avatars/kenji.jpg',
                badge: 'Up to 10 Minutes',
                title: locale === 'vi' ? 'Đồng Nhất Nhân Vật Cho Video Dài Tới 10 Phút' : 'Consistent AI Characters for Long Videos',
                desc:
                  locale === 'vi'
                    ? 'Tạo video thuyết trình, đào tạo dài tới 10 phút mà vẫn giữ nguyên diện mạo, trang phục và thần thái nhân vật xuyên suốt mọi cảnh.'
                    : "Create AI avatar videos up to 10 minutes long while keeping your character's appearance and identity consistent in every scene.",
                cta: 'Explore AI Video →',
                href: '/studio?tab=ai-video',
              },
              {
                img: '/assets/avatars/sofia.jpg',
                badge: '1,000+ Voices · 88 Languages',
                title: locale === 'vi' ? 'Giọng Đọc AI Đa Ngôn Ngữ Cho Khán Giả Toàn Cầu' : 'Multilingual AI Voices for Global Audiences',
                desc:
                  locale === 'vi'
                    ? 'Lựa chọn hơn 1.000 giọng đọc tự nhiên thuộc 88 ngôn ngữ và vùng miền, hoặc nhân bản giọng nói cá nhân của chính bạn.'
                    : 'Choose from over 1,000 natural AI voices across 88 languages, countries, and regional accents, or clone your own voice.',
                cta: 'Explore AI Voices →',
                href: '/studio?tab=ai-tools&tool=voice-clone',
              },
              {
                img: '/assets/avatars/david.jpg',
                badge: '720p · 1080p · 2K',
                title: locale === 'vi' ? 'Độ Phân Giải Sắc Nét Lên Đến 2K' : 'High-Resolution up to 2K',
                desc:
                  locale === 'vi'
                    ? 'Xuất bản video chuyên nghiệp ở độ phân giải 720p, 1080p Full HD hoặc 2K siêu nét kèm tách phông xanh cho marketing và đào tạo.'
                    : 'Export professional AI avatar videos in 720p, 1080p, or crisp 2K resolution for marketing, training, and social media.',
                cta: 'Explore HD Video →',
                href: '/studio?tab=ai-video',
              },
            ].map((card) => (
              <div key={card.title} className="vs-card vs-card-interactive" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 250, position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={card.img}
                    alt={card.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 22%' }}
                  />
                  <span className="vs-tag vs-tag-brand" style={{ position: 'absolute', top: 14, left: 14 }}>
                    {card.badge}
                  </span>
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <h3 className="vs-h3">{card.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', flex: 1 }}>{card.desc}</p>
                  <Link href={card.href} style={{ color: 'var(--accent-brand)', fontWeight: 650, fontSize: '0.9rem' }}>
                    {card.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI VIDEO AGENT + POINT TOOLS COMPARISON TABLE */}
      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-grid-2" style={{ alignItems: 'center', marginBottom: 48 }}>
            <div>
              <span className="vs-eyebrow">{t.sections.agentEyebrow}</span>
              <h2 className="vs-h2" style={{ marginBottom: 14 }}>{t.sections.agentTitle}</h2>
              <p className="vs-lead" style={{ marginBottom: 24 }}>{t.sections.agentDesc}</p>
              <Link href="/studio?tab=ai-agent" className="vs-btn vs-btn-primary">
                <span>Try AI Agent</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="vs-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="vs-tag vs-tag-teal">Multi-Shot Storyboard Planner</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>16:9 · 9:16 · 1:1</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { shot: 'Shot 01 · Hook', line: 'Turn any product URL or deck into a hosted multi-scene video.' },
                  { shot: 'Shot 02 · Demo', line: 'Automatic voiceover, V-Character lip-sync, and dynamic captions.' },
                  { shot: 'Shot 03 · Chat Edit', line: '"Make Shot 2 punchier and localize into Vietnamese & Spanish."' },
                ].map((s) => (
                  <div
                    key={s.shot}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-hairline)',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-brand)', marginBottom: 3 }}>
                      {s.shot}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{s.line}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="vs-h3" style={{ marginBottom: 16 }}>
            {locale === 'vi'
              ? 'So sánh AI Agent với các công cụ rời rạc truyền thống'
              : 'One AI video generator for the full production cycle'}
          </h3>
          <div className="vs-table-wrap">
            <table className="vs-table">
              <thead>
                <tr>
                  <th>{locale === 'vi' ? 'Nhu cầu sản xuất' : 'What you need'}</th>
                  <th>{locale === 'vi' ? 'Công cụ đơn lẻ (Point tools)' : 'Point tools'}</th>
                  <th style={{ color: 'var(--accent-teal)' }}>VisionStory AI Agent</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Start from a prompt, URL, or deck', 'Limited', 'Built in'],
                  ['Script and multi-shot plan', 'Separate step', 'Automatic'],
                  ['Avatar, voiceover, and captions', 'Multiple tools', 'Integrated'],
                  ['Revise a shot after the first draft', 'Manual re-editing', 'Scene-level chat edits'],
                  ['Ready for ads, training, or product pages', 'Generic output', 'Purpose-built'],
                ].map(([need, point, agent]) => (
                  <tr key={need}>
                    <td style={{ fontWeight: 600 }}>{need}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{point}</td>
                    <td style={{ color: 'var(--accent-teal)', fontWeight: 650 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Check size={15} /> {agent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. AI MUSIC VIDEO & 5. AI VIDEO PODCAST */}
      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-grid-2" style={{ alignItems: 'center', marginBottom: 72 }}>
            <div className="vs-card" style={{ overflow: 'hidden' }}>
              <img
                src="/assets/showcase/music-singer.jpg"
                alt="AI Music Video Studio Singer"
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Music size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Supports MP3, WAV, Suno & Udio tracks
                </span>
                <span className="vs-tag vs-tag-brand">Natural Singing Lip-Sync</span>
              </div>
            </div>

            <div>
              <span className="vs-eyebrow">{t.sections.musicEyebrow}</span>
              <h2 className="vs-h2" style={{ marginBottom: 14 }}>{t.sections.musicTitle}</h2>
              <p className="vs-lead" style={{ marginBottom: 20 }}>{t.sections.musicDesc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                <span className="vs-tag">Works With Any Song</span>
                <span className="vs-tag">Natural Singing Lip Sync</span>
                <span className="vs-tag">Cinematic Multi-Shot Scenes</span>
              </div>
              <Link href="/studio?tab=viral-music" className="vs-btn vs-btn-primary">
                <span>Make Your Music Video</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="vs-grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span className="vs-eyebrow">{t.sections.podcastEyebrow}</span>
              <h2 className="vs-h2" style={{ marginBottom: 14 }}>{t.sections.podcastTitle}</h2>
              <p className="vs-lead" style={{ marginBottom: 22 }}>{t.sections.podcastDesc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['01 · Upload Your Podcast Audio', 'Upload MP3/WAV — including Google NotebookLM audio — and auto-split speakers.'],
                  ['02 · Start from a Studio Template', 'Assign two host portraits, studio lighting, and broadcast layout.'],
                  ['03 · Type a Two-Host Script', 'Write or generate conversational banter and render in one click.'],
                ].map(([title, sub]) => (
                  <div key={title} style={{ padding: '10px 14px', borderRadius: 11, background: 'var(--bg-elevated)', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ fontWeight: 650, fontSize: '0.9rem' }}>{title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sub}</div>
                  </div>
                ))}
              </div>
              <Link href="/studio?tab=podcast" className="vs-btn vs-btn-primary">
                <Mic size={16} />
                <span>Make a Video Podcast</span>
              </Link>
            </div>

            <div className="vs-card" style={{ overflow: 'hidden' }}>
              <img
                src="/assets/showcase/podcast-studio.jpg"
                alt="Dual Host AI Video Podcast"
                style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Auto Two-Speaker Diarization & Lip-Sync
                </span>
                <span className="vs-tag vs-tag-teal">NotebookLM Compatible</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI VIDEO & PHOTO FACE SWAP */}
      <section className="vs-section">
        <div className="vs-container">
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 36px' }}>
            <span className="vs-eyebrow">{t.sections.faceswapEyebrow}</span>
            <h2 className="vs-h2" style={{ marginBottom: 12 }}>{t.sections.faceswapTitle}</h2>
            <p className="vs-lead" style={{ margin: '0 auto 18px' }}>{t.sections.faceswapDesc}</p>
            <div className="vs-segmented">
              <button
                type="button"
                className={`vs-segmented-btn ${faceSwapTab === 'video' ? 'active' : ''}`}
                onClick={() => setFaceSwapTab('video')}
              >
                Video Face Swap
              </button>
              <button
                type="button"
                className={`vs-segmented-btn ${faceSwapTab === 'photo' ? 'active' : ''}`}
                onClick={() => setFaceSwapTab('photo')}
              >
                Photo Face Swap
              </button>
            </div>
          </div>

          <div className="vs-card" style={{ maxWidth: 860, margin: '0 auto', padding: 28 }}>
            <div className="vs-grid-2" style={{ marginBottom: 20 }}>
              <Link
                href={`/studio?tab=face-swap&mode=${faceSwapTab}`}
                style={{
                  border: '1px dashed var(--border-strong)',
                  borderRadius: 16,
                  padding: 28,
                  textAlign: 'center',
                  background: 'var(--bg-elevated)',
                }}
              >
                <Upload size={26} style={{ color: 'var(--accent-brand)', marginBottom: 10 }} />
                <div style={{ fontWeight: 650, marginBottom: 4 }}>1. Upload Reference Face</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Click or drop the portrait face you want to use
                </div>
              </Link>

              <Link
                href={`/studio?tab=face-swap&mode=${faceSwapTab}`}
                style={{
                  border: '1px dashed var(--border-strong)',
                  borderRadius: 16,
                  padding: 28,
                  textAlign: 'center',
                  background: 'var(--bg-elevated)',
                }}
              >
                <Play size={26} style={{ color: 'var(--accent-teal)', marginBottom: 10 }} />
                <div style={{ fontWeight: 650, marginBottom: 4 }}>
                  2. Upload Target {faceSwapTab === 'video' ? 'Video Clip' : 'Photo'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Frame-by-frame motion, lighting & expression alignment
                </div>
              </Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                ✓ Free · No sign-up required · No watermark · HD output
              </span>
              <Link href={`/studio?tab=face-swap&mode=${faceSwapTab}`} className="vs-btn vs-btn-primary">
                <Wand2 size={16} />
                <span>Try Face Swap Free</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEEDANCE 2.5 & VIDEO MODELS */}
      <section className="vs-section">
        <div className="vs-container">
          <div style={{ marginBottom: 32 }}>
            <span className="vs-eyebrow">{t.sections.modelsEyebrow}</span>
            <h2 className="vs-h2" style={{ marginBottom: 12 }}>{t.sections.modelsTitle}</h2>
            <p className="vs-lead">{t.sections.modelsDesc}</p>
          </div>

          <div className="vs-card" style={{ padding: 24, marginBottom: 28 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {['Text To Video', 'Image To Video', '30-Second Clips', 'AI Video Ads', 'Redraw Editing'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSeedanceMode(mode)}
                  className={seedanceMode === mode ? 'vs-tag vs-tag-brand' : 'vs-tag'}
                  style={{ padding: '6px 13px', cursor: 'pointer' }}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="vs-grid-2" style={{ alignItems: 'center' }}>
              <div>
                <textarea
                  className="vs-textarea"
                  value={seedancePrompt}
                  onChange={(e) => setSeedancePrompt(e.target.value)}
                  style={{ marginBottom: 14 }}
                />
                <Link
                  href={`/studio?tab=seedance&prompt=${encodeURIComponent(seedancePrompt)}`}
                  className="vs-btn vs-btn-primary"
                >
                  <span>Try Seedance 2.5</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-hairline)' }}>
                <img
                  src="/assets/showcase/seedance-cinema.jpg"
                  alt="Seedance 2.5 Cinema Output"
                  style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>

          <div className="vs-grid-3">
            {AI_MODELS.filter((m) => ['kling-o3', 'minimax-h3', 'wan-3.0'].includes(m.id)).map((model) => (
              <div key={model.id} className="vs-card vs-card-interactive" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{model.name}</span>
                  <span className="vs-tag">{model.badge}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', flex: 1 }}>
                  {locale === 'vi' ? model.summaryVi : model.summaryEn}
                </p>
                <Link
                  href={`/studio?tab=seedance&model=${model.apiId}`}
                  style={{ color: 'var(--accent-brand)', fontWeight: 650, fontSize: '0.88rem' }}
                >
                  Explore {model.name} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DEVELOPER CLI, AGENT SKILL & MCP */}
      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-grid-2" style={{ alignItems: 'start' }}>
            <div>
              <span className="vs-eyebrow">{t.sections.devEyebrow}</span>
              <h2 className="vs-h2" style={{ marginBottom: 14 }}>{t.sections.devTitle}</h2>
              <p className="vs-lead" style={{ marginBottom: 24 }}>{t.sections.devDesc}</p>

              <div className="vs-card" style={{ padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 8 }}>
                  VisionStory CLI · Install once. Use every API from your terminal.
                </div>
                <div
                  className="mono"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                    background: 'hsl(222, 24%, 5%)',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border-hairline)',
                    fontSize: '0.83rem',
                    color: 'hsl(168, 80%, 68%)',
                  }}
                >
                  <span>$ curl -fsSL https://developers.visionstory.ai/cli | bash</span>
                  <button
                    type="button"
                    className="vs-btn vs-btn-secondary vs-btn-sm"
                    onClick={() =>
                      copyText('curl -fsSL https://developers.visionstory.ai/cli | bash', 'CLI install command')
                    }
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 8 }}>
                  macOS · Linux · WSL · REST API · Python SDK · MCP Server
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Link href="/openapi" className="vs-btn vs-btn-primary">
                  <span>Explore Developer Docs & Playground</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href="/openapi#api-keys" className="vs-btn vs-btn-secondary">
                  Get API Key
                </Link>
              </div>
            </div>

            <div className="vs-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Object.keys(AGENT_SETUP_PROMPTS).map((agent) => (
                    <button
                      key={agent}
                      type="button"
                      onClick={() => setCodingAgent(agent)}
                      className={codingAgent === agent ? 'vs-tag vs-tag-brand' : 'vs-tag'}
                      style={{ cursor: 'pointer', padding: '5px 10px' }}
                    >
                      {agent}
                    </button>
                  ))}
                </div>

                <div className="vs-segmented">
                  <button
                    type="button"
                    className={`vs-segmented-btn ${agentProtocol === 'skill' ? 'active' : ''}`}
                    onClick={() => setAgentProtocol('skill')}
                  >
                    Agent Skill
                  </button>
                  <button
                    type="button"
                    className={`vs-segmented-btn ${agentProtocol === 'mcp' ? 'active' : ''}`}
                    onClick={() => setAgentProtocol('mcp')}
                  >
                    MCP
                  </button>
                </div>
              </div>

              <pre
                className="mono"
                style={{
                  background: 'hsl(222, 24%, 5%)',
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid var(--border-hairline)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  marginBottom: 14,
                }}
              >
                {agentProtocol === 'mcp'
                  ? `{\n  "mcpServers": {\n    "visionstory": {\n      "command": "npx",\n      "args": ["-y", "@visionstory/mcp-server"],\n      "env": { "VISIONSTORY_API_KEY": "vs_live_..." }\n    }\n  }\n}`
                  : AGENT_SETUP_PROMPTS[codingAgent]}
              </pre>

              <button
                type="button"
                className="vs-btn vs-btn-secondary vs-btn-sm"
                onClick={() =>
                  copyText(
                    agentProtocol === 'mcp'
                      ? '{"mcpServers":{"visionstory":{"command":"npx","args":["-y","@visionstory/mcp-server"]}}}'
                      : AGENT_SETUP_PROMPTS[codingAgent],
                    `${codingAgent} setup prompt`
                  )
                }
              >
                <Copy size={14} /> Copy setup prompt for {codingAgent}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. VISIONSTORY CREATOR TOOLS SHOWCASE */}
      <section className="vs-section">
        <div className="vs-container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 34 }}>
            <div>
              <span className="vs-eyebrow">{t.sections.toolsEyebrow}</span>
              <h2 className="vs-h2">{t.sections.toolsTitle}</h2>
            </div>
            <Link href="/tools" className="vs-btn vs-btn-secondary">
              See All 14+ Tools →
            </Link>
          </div>

          <div className="vs-grid-4">
            {[
              {
                img: '/assets/avatars/linh.jpg',
                title: 'AI Image (Nano Banana 2)',
                desc: 'Create 2K portraits, virtual influencers, and campaign shots from prompts.',
                href: '/studio?tab=ai-tools&tool=image-gen',
              },
              {
                img: '/assets/avatars/golden-podcaster.jpg',
                title: 'Pet Video (Cat & Dog)',
                desc: 'Put your dog or cat in a talking podcast or singing skit video.',
                href: '/studio?tab=ai-video&avatar=av_golden_pet',
              },
              {
                img: '/assets/avatars/marcus.jpg',
                title: 'AI Green Screen',
                desc: 'Export your talking presenter on clean chroma-key green screen.',
                href: '/studio?tab=ai-video&greenscreen=1',
              },
              {
                img: '/assets/avatars/aria.jpg',
                title: 'Remove Background',
                desc: 'Cut out portraits and product images to transparent PNG in one click.',
                href: '/studio?tab=ai-tools&tool=bg-remove',
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="vs-card vs-card-interactive"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: '100%', height: 190, objectFit: 'cover', objectPosition: 'center 20%' }}
                />
                <div style={{ padding: 18 }}>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. VERIFIED G2 REVIEWS */}
      <section className="vs-section">
        <div className="vs-container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 38px' }}>
            <span className="vs-eyebrow">9 G2 Awards · Fall 2026</span>
            <h2 className="vs-h2" style={{ marginBottom: 10 }}>{t.sections.reviewsTitle}</h2>
            <p className="vs-lead">{t.sections.reviewsDesc}</p>
          </div>

          <div className="vs-grid-3">
            {[
              {
                initials: 'AG',
                author: 'AKI G.',
                role: 'Small-Business · International Trade',
                headline: 'VisionStory AI Delivers Strong ROI with Fast, High-Quality Video Creation',
                quote:
                  'It helps me create high-quality video content much faster and at a lower cost than traditional production. The AI understands prompts well, produces natural results, and makes it easy to test creative ideas quickly.',
              },
              {
                initials: 'TL',
                author: 'Tony L.',
                role: 'Small-Business · Animation',
                headline: 'High-Quality Talking Videos at a Competitive Price',
                quote:
                  'VisionStory is able to create high-quality talking videos at a very competitive cost. The video generation cost can be less than $1 per minute, while the final result is comparable to leading AI video models.',
              },
              {
                initials: 'AM',
                author: 'Aaron Misael G.',
                role: 'Small-Business · Educational Media',
                headline: 'Easy-to-Use Tool, Ideal for Educational Content',
                quote:
                  'You do not really need to know much about AI to get started. Simply type what the character is going to say and let VisionStory AI do everything — from lip-sync to captions.',
              },
            ].map((rev) => (
              <div key={rev.author} className="vs-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ color: '#f59e0b', letterSpacing: 2, fontSize: '0.95rem' }}>★★★★★</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.35 }}>{rev.headline}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', flex: 1 }}>“{rev.quote}”</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border-hairline)' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--accent-brand-soft)',
                      color: 'var(--accent-brand)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                    }}
                  >
                    {rev.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 650, fontSize: '0.86rem' }}>{rev.author}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section className="vs-section">
        <div className="vs-container" style={{ maxWidth: 860 }}>
          <h2 className="vs-h2" style={{ textAlign: 'center', marginBottom: 32 }}>
            {t.sections.faqTitle}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HOME_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.qEn} className="vs-card" style={{ padding: '16px 20px' }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      textAlign: 'left',
                      fontWeight: 650,
                      fontSize: '0.98rem',
                    }}
                  >
                    <span>{locale === 'vi' ? faq.qVi : faq.qEn}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.18s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <p style={{ marginTop: 12, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {locale === 'vi' ? faq.aVi : faq.aEn}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. BOTTOM CTA */}
      <section className="vs-section-compact" style={{ borderBottom: 'none' }}>
        <div className="vs-container">
          <div
            className="vs-card"
            style={{
              padding: '52px 32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, hsla(16, 85%, 45%, 0.18), hsla(222, 20%, 10%, 0.96))',
            }}
          >
            <h2 className="vs-h2" style={{ marginBottom: 12 }}>{t.sections.bottomCtaTitle}</h2>
            <p className="vs-lead" style={{ margin: '0 auto 26px' }}>{t.sections.bottomCtaDesc}</p>
            <Link href="/studio" className="vs-btn vs-btn-primary vs-btn-lg">
              <span>Try It Free in Studio</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
