'use client';

import React from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';
import { useVisionStory } from './VisionStoryProvider';

export function Footer() {
  const { locale, setLocale } = useVisionStory();

  return (
    <footer className="vs-footer">
      <div className="vs-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 28,
            paddingBottom: 36,
            borderBottom: '1px solid var(--border-hairline)',
          }}
        >
          <div style={{ maxWidth: 380 }}>
            <Link href="/" className="vs-brand" style={{ marginBottom: 10 }}>
              <span className="vs-brand-mark">V</span>
              <span>VisionStory</span>
            </Link>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 10 }}>
              {locale === 'vi'
                ? 'Thổi hồn vào hình ảnh của bạn bằng video AI nhân vật nói chuyện sống động!'
                : 'Bring your images to life with AI-powered talking videos!'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              <span className="vs-tag vs-tag-brand">
                <Award size={13} /> G2 4.7/5 · High Performer Fall 2026
              </span>
              <button
                type="button"
                onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
                className="vs-tag"
                style={{ cursor: 'pointer' }}
              >
                {locale === 'en' ? 'English · Tiếng Việt' : 'Tiếng Việt · English'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, fontSize: '0.85rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 3 }}>Support</div>
              <a href="mailto:feedback@visionstory.ai" style={{ fontWeight: 600 }}>
                feedback@visionstory.ai
              </a>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 3 }}>Collaboration</div>
              <a href="mailto:collabs@visionstory.ai" style={{ fontWeight: 600 }}>
                collabs@visionstory.ai
              </a>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 3 }}>Join Us</div>
              <a href="mailto:careers@visionstory.ai" style={{ fontWeight: 600 }}>
                careers@visionstory.ai
              </a>
            </div>
          </div>
        </div>

        <div className="vs-footer-cols">
          <div className="vs-footer-col">
            <h4>Features</h4>
            <ul>
              <li><Link href="/studio?tab=ai-video">AI Video</Link></li>
              <li><Link href="/studio?tab=ai-agent">AI Video Agent</Link></li>
              <li><Link href="/studio?tab=viral-music">AI Music Video</Link></li>
              <li><Link href="/studio?tab=face-swap">Video Face Swap</Link></li>
              <li><Link href="/studio?tab=ai-agent">AI Video Ads</Link></li>
              <li><Link href="/studio?tab=presentation">AI Presentation</Link></li>
              <li><Link href="/studio?tab=podcast">Video Podcast</Link></li>
              <li><Link href="/studio?tab=ai-tools&tool=voice-clone">Voice Clone</Link></li>
              <li><Link href="/studio?tab=ai-tools&tool=tts">Text to Speech</Link></li>
            </ul>
          </div>

          <div className="vs-footer-col">
            <h4>AI Tools</h4>
            <ul>
              <li><Link href="/studio?tab=ai-video">AI Avatar</Link></li>
              <li><Link href="/studio?tab=ai-agent">AI UGC</Link></li>
              <li><Link href="/studio?tab=ai-tools&tool=image-gen">AI Influencer</Link></li>
              <li><Link href="/studio?tab=ai-tools&tool=image-gen">AI Image Generator</Link></li>
              <li><Link href="/studio?tab=ai-tools&tool=upscale">Upscale Video</Link></li>
              <li><Link href="/studio?tab=ai-tools&tool=bg-remove">Green Screen Video</Link></li>
              <li><Link href="/studio?tab=ai-tools&tool=audio-clean">Voice Changer & Noise</Link></li>
              <li><Link href="/studio?tab=ai-video&avatar=av_golden_pet">AI Cat & Dog Video</Link></li>
              <li><Link href="/tools">All AI Tools →</Link></li>
            </ul>
          </div>

          <div className="vs-footer-col">
            <h4>AI Models</h4>
            <ul>
              <li><Link href="/tools#models">V-Character 4.0</Link></li>
              <li><Link href="/studio?tab=seedance&model=wan-3.0">Wan 3.0</Link></li>
              <li><Link href="/studio?tab=ai-tools&tool=image-gen">Nano Banana 2</Link></li>
              <li><Link href="/studio?tab=seedance&model=seedance-2.5">Seedance 2.5</Link></li>
              <li><Link href="/studio?tab=seedance&model=minimax-h3">MiniMax H3</Link></li>
              <li><Link href="/studio?tab=seedance&model=kling-o3">Kling O3</Link></li>
              <li><Link href="/tools#models">All AI Models →</Link></li>
            </ul>
          </div>

          <div className="vs-footer-col">
            <h4>Solutions</h4>
            <ul>
              <li><Link href="/tools#solutions">Video Creators</Link></li>
              <li><Link href="/tools#solutions">Marketing Teams</Link></li>
              <li><Link href="/tools#solutions">Sales Teams</Link></li>
              <li><Link href="/tools#solutions">Learning & Development</Link></li>
              <li><Link href="/tools#solutions">Customer Success</Link></li>
              <li><Link href="/tools#solutions">Agencies</Link></li>
              <li><Link href="/tools#solutions">Creator Monetization</Link></li>
            </ul>
          </div>

          <div className="vs-footer-col">
            <h4>Comparisons</h4>
            <ul>
              <li><Link href="/tools#comparisons">VisionStory vs HeyGen</Link></li>
              <li><Link href="/tools#comparisons">VisionStory vs Synthesia</Link></li>
              <li><Link href="/tools#comparisons">VisionStory vs D-ID</Link></li>
              <li><Link href="/tools#comparisons">VisionStory vs Vidnoz</Link></li>
              <li><Link href="/tools#comparisons">VisionStory vs Akool</Link></li>
            </ul>
          </div>

          <div className="vs-footer-col">
            <h4>Resources & Pricing</h4>
            <ul>
              <li><Link href="/pricing">Pricing Plans</Link></li>
              <li><Link href="/openapi">Developer API & MCP</Link></li>
              <li><Link href="/tools#tutorials">Tutorials & Guides</Link></li>
              <li><Link href="/pricing#faq">Help Center & FAQ</Link></li>
              <li><Link href="/openapi#cli">VisionStory CLI</Link></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: 44,
            paddingTop: 22,
            borderTop: '1px solid var(--border-hairline)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: '0.79rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>© 2026 VisionStory AI Clone · Built with V-Character 4.0 Studio Architecture</span>
          <div style={{ display: 'flex', gap: 18 }}>
            <Link href="/pricing">Privacy Policy</Link>
            <Link href="/pricing">Refund Policy</Link>
            <Link href="/pricing">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
