'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Coins, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useVisionStory } from './VisionStoryProvider';

export function GlobalModals() {
  const {
    locale,
    user,
    ledger,
    providerKeysConfigured,
    authModalOpen,
    setAuthModalOpen,
    settingsModalOpen,
    setSettingsModalOpen,
    ledgerModalOpen,
    setLedgerModalOpen,
    refreshState,
    showToast,
  } = useVisionStory();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [elevenKey, setElevenKey] = useState('');
  const [replicateKey, setReplicateKey] = useState('');

  const handleLogin = async (provider: 'google' | 'facebook' | 'email') => {
    const chosenEmail =
      email.trim() ||
      (provider === 'google'
        ? 'creator@gmail.com'
        : provider === 'facebook'
        ? 'creator@fb.com'
        : 'studio@visionstory.ai');
    const chosenName =
      name.trim() ||
      (provider === 'google'
        ? 'Alex Creator'
        : provider === 'facebook'
        ? 'Alex Social'
        : chosenEmail.split('@')[0]);

    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        provider,
        email: chosenEmail,
        name: chosenName,
      }),
    });
    await refreshState();
    setAuthModalOpen(false);
    showToast(
      locale === 'vi'
        ? `Chào mừng ${chosenName}! Tài khoản đã đồng bộ cùng ${user.credits} credits.`
        : `Welcome ${chosenName}! Signed in with ${user.credits} active credits.`
    );
  };

  const handleSaveProviderKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_provider_keys',
        openaiApiKey: openaiKey,
        geminiApiKey: geminiKey,
        elevenlabsApiKey: elevenKey,
        replicateApiToken: replicateKey,
      }),
    });
    await refreshState();
    setSettingsModalOpen(false);
    showToast(
      locale === 'vi'
        ? 'Đã lưu cấu hình API Keys bên thứ ba an toàn vào máy chủ cục bộ.'
        : 'Saved external AI provider API keys to local studio storage.'
    );
  };

  const handleBuyCreditPack = async (pack: number) => {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'buy_credits', credits: pack }),
    });
    await refreshState();
    showToast(
      locale === 'vi'
        ? `Đã nạp thành công +${pack} Permanent Credits (không giới hạn thời hạn)!`
        : `Added +${pack} Permanent Credits (never expire)!`
    );
  };

  return (
    <>
      {/* Auth Modal matching app.visionstory.ai */}
      {authModalOpen && (
        <div className="vs-modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="vs-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="vs-brand-mark">V</span>
                <div>
                  <h3 className="vs-h3">
                    {locale === 'vi' ? 'Đăng nhập VisionStory AI' : 'Sign in to VisionStory'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {locale === 'vi'
                      ? 'Nhận ngay 10 sign-up credits miễn phí khi bắt đầu'
                      : '10 free sign-up credits included · No card needed'}
                  </p>
                </div>
              </div>
              <button type="button" className="vs-btn-ghost" onClick={() => setAuthModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <button
                type="button"
                className="vs-btn vs-btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px 16px' }}
                onClick={() => handleLogin('google')}
              >
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                className="vs-btn vs-btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px 16px' }}
                onClick={() => handleLogin('facebook')}
              >
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div
              style={{
                textAlign: 'center',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                margin: '12px 0',
              }}
            >
              — {locale === 'vi' ? 'hoặc tiếp tục bằng Email' : 'or continue with Email'} —
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                className="vs-input"
                placeholder={locale === 'vi' ? 'Tên hiển thị của bạn' : 'Your display name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="vs-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                className="vs-btn vs-btn-primary"
                style={{ width: '100%', marginTop: 4 }}
                onClick={() => handleLogin('email')}
              >
                <Mail size={15} />
                <span>Continue with Email</span>
              </button>
            </div>

            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.45 }}>
              By continuing, you agree to set up a VisionStory account and agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </div>
      )}

      {/* External AI Provider API Keys Modal */}
      {settingsModalOpen && (
        <div className="vs-modal-backdrop" onClick={() => setSettingsModalOpen(false)}>
          <div className="vs-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <KeyRound size={20} style={{ color: 'var(--accent-brand)' }} />
                <h3 className="vs-h3">
                  {locale === 'vi'
                    ? 'Cấu hình Engine AI & API Keys mở rộng'
                    : 'AI Engine & Optional External API Keys'}
                </h3>
              </div>
              <button type="button" className="vs-btn-ghost" onClick={() => setSettingsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              {locale === 'vi'
                ? 'Mặc định VisionStory Studio đã chạy thực tế 100% ngay lập tức (Canvas Video Renderer + WebM + Giọng đọc TTS + Lưu trữ cục bộ). Bạn có thể cắm thêm khóa API bên dưới để mở rộng LLM/TTS đám mây:'
                : 'VisionStory Studio works 100% out of the box using the built-in Canvas WebM Video Synthesizer & Neural Web Speech engine. Optionally attach external cloud keys below:'}
            </p>

            <form onSubmit={handleSaveProviderKeys} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>OpenAI API Key (AI Video Agent Storyboard LLM)</span>
                  {providerKeysConfigured.openai && (
                    <span style={{ color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> Active
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  className="vs-input"
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Google Gemini API Key (Nano Banana 2 / Script Director)</span>
                  {providerKeysConfigured.gemini && (
                    <span style={{ color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> Active
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  className="vs-input"
                  placeholder="AIza..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>ElevenLabs API Key (Cloud Voice Clone Synthesis)</span>
                  {providerKeysConfigured.elevenlabs && (
                    <span style={{ color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> Active
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  className="vs-input"
                  placeholder="xi-..."
                  value={elevenKey}
                  onChange={(e) => setElevenKey(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Replicate API Token (Cloud Seedance / Kling / FaceSwap)</span>
                  {providerKeysConfigured.replicate && (
                    <span style={{ color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> Active
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  className="vs-input"
                  placeholder="r8_..."
                  value={replicateKey}
                  onChange={(e) => setReplicateKey(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-surface)',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <ShieldCheck size={16} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                <span>Keys are stored server-side only in local data/visionstory-db.json and never exposed publicly.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <button type="button" className="vs-btn vs-btn-secondary" onClick={() => setSettingsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="vs-btn vs-btn-primary">
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Usage Details & Top-up Modal */}
      {ledgerModalOpen && (
        <div className="vs-modal-backdrop" onClick={() => setLedgerModalOpen(false)}>
          <div className="vs-modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Coins size={20} style={{ color: 'var(--accent-teal)' }} />
                <div>
                  <h3 className="vs-h3">Credit Usage Details & Balance</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Current Plan: <strong style={{ textTransform: 'uppercase', color: 'var(--text-primary)' }}>{user.plan}</strong> · Balance: <strong>{user.credits} credits</strong>
                  </p>
                </div>
              </div>
              <button type="button" className="vs-btn-ghost" onClick={() => setLedgerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                marginBottom: 18,
              }}
            >
              {[
                { pack: 60, price: '$5.99' },
                { pack: 200, price: '$16.99' },
                { pack: 600, price: '$42.99' },
              ].map((item) => (
                <button
                  key={item.pack}
                  type="button"
                  onClick={() => handleBuyCreditPack(item.pack)}
                  className="vs-card vs-card-interactive"
                  style={{ padding: 12, textAlign: 'center' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    +{item.pack} Credits
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-brand)', marginTop: 2 }}>
                    Buy Pack · {item.price}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Recent Credit Ledger
            </div>
            <div
              style={{
                maxHeight: 260,
                overflowY: 'auto',
                border: '1px solid var(--border-hairline)',
                borderRadius: 12,
              }}
            >
              {ledger.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--border-hairline)',
                    fontSize: '0.83rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 560 }}>{tx.description}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: tx.amount >= 0 ? 'var(--accent-teal)' : 'var(--accent-brand)',
                      marginLeft: 12,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} cr
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
