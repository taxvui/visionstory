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

  const [showEmailForm, setShowEmailForm] = useState(false);
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
    setShowEmailForm(false);
    showToast(
      locale === 'vi'
        ? `Chào mừng ${chosenName}! Đã đăng nhập với ${user.credits} credits.`
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
        ? 'Đã lưu cấu hình API Keys mở rộng vào máy chủ cục bộ.'
        : 'Saved external AI provider API keys.'
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
        ? `Đã nạp +${pack} Permanent Credits thành công!`
        : `Added +${pack} Permanent Credits (never expire)!`
    );
  };

  return (
    <>
      {/* Exact 1:1 Log In Modal matching app.visionstory.ai (01_ai_video.png) */}
      {authModalOpen && (
        <div className="vs-modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="vs-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {locale === 'vi' ? 'Đăng nhập' : 'Log In'}
              </h3>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                style={{ color: 'rgba(255,255,255,0.65)', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Continue with Google (White Pill) */}
              <button
                type="button"
                onClick={() => handleLogin('google')}
                style={{
                  height: 46,
                  borderRadius: 999,
                  background: '#ffffff',
                  color: '#111216',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  position: 'relative',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ position: 'absolute', left: 18 }}>
                  <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-2 3l3.2 2.5c1.9-1.7 3-4.3 3-7.4 0-.7-.1-1.4-.2-2H12z" />
                  <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6C4.7 19.8 8.1 22 12 22z" />
                  <path fill="#FBBC05" d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3.1C2.4 8.9 2 10.4 2 12s.4 3.1 1.1 4.5l3.3-2.6z" />
                  <path fill="#4285F4" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 2.9 14.7 2 12 2 8.1 2 4.7 4.2 3.1 7.5l3.3 2.6c.8-2.3 3-4.2 5.6-4.2z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Continue with Facebook */}
              <button
                type="button"
                onClick={() => handleLogin('facebook')}
                style={{
                  height: 46,
                  borderRadius: 999,
                  background: '#2a2c35',
                  color: '#ffffff',
                  fontWeight: 550,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 18,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#1877F2',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                  }}
                >
                  f
                </span>
                <span>Continue with Facebook</span>
              </button>

              {/* Continue with Apple */}
              <button
                type="button"
                onClick={() => handleLogin('google')}
                style={{
                  height: 46,
                  borderRadius: 999,
                  background: '#2a2c35',
                  color: '#ffffff',
                  fontWeight: 550,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white" style={{ position: 'absolute', left: 19 }}>
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>Continue with Apple</span>
              </button>

              {/* Continue with Email */}
              <button
                type="button"
                onClick={() => setShowEmailForm((v) => !v)}
                style={{
                  height: 46,
                  borderRadius: 999,
                  background: '#2a2c35',
                  color: '#ffffff',
                  fontWeight: 550,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Mail size={17} style={{ position: 'absolute', left: 19, opacity: 0.9 }} />
                <span>Continue with Email</span>
              </button>
            </div>

            {showEmailForm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14 }}>
                <input
                  type="text"
                  className="vs-input"
                  placeholder="Your display name"
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
                  style={{ width: '100%' }}
                  onClick={() => handleLogin('email')}
                >
                  Sign In with Email
                </button>
              </div>
            )}

            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: 22,
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              By continuing, you agree to set up a VisionStory account and agree to our{' '}
              <span style={{ color: '#fff', textDecoration: 'underline' }}>Terms of Use</span> and{' '}
              <span style={{ color: '#fff', textDecoration: 'underline' }}>Privacy Policy</span>.
            </p>
          </div>
        </div>
      )}

      {/* External AI Provider API Keys Modal */}
      {settingsModalOpen && (
        <div className="vs-modal-backdrop" onClick={() => setSettingsModalOpen(false)}>
          <div className="vs-modal" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <KeyRound size={19} style={{ color: 'var(--accent-brand)' }} />
                <h3 className="vs-h3">AI Engine & External Cloud Keys</h3>
              </div>
              <button type="button" className="vs-btn-ghost" onClick={() => setSettingsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              VisionStory Studio works 100% out-of-the-box via built-in Canvas WebM synthesis & neural Web Speech. Optionally attach cloud keys below:
            </p>

            <form onSubmit={handleSaveProviderKeys} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                { label: 'OpenAI API Key (AI Agent Storyboard LLM)', val: openaiKey, set: setOpenaiKey, ph: 'sk-...', ok: providerKeysConfigured.openai },
                { label: 'Google Gemini API Key (Nano Banana 2 / Script)', val: geminiKey, set: setGeminiKey, ph: 'AIza...', ok: providerKeysConfigured.gemini },
                { label: 'ElevenLabs API Key (Cloud Voice Clone)', val: elevenKey, set: setElevenKey, ph: 'xi-...', ok: providerKeysConfigured.elevenlabs },
                { label: 'Replicate API Token (Cloud Video Models)', val: replicateKey, set: setReplicateKey, ph: 'r8_...', ok: providerKeysConfigured.replicate },
              ].map((item) => (
                <div key={item.label}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>{item.label}</span>
                    {item.ok && (
                      <span style={{ color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={12} /> Active
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    className="vs-input"
                    placeholder={item.ph}
                    value={item.val}
                    onChange={(e) => item.set(e.target.value)}
                  />
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: '#12131c',
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <ShieldCheck size={15} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                <span>Keys are stored server-side only and never exposed publicly.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <button type="button" className="vs-btn vs-btn-secondary vs-btn-sm" onClick={() => setSettingsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="vs-btn vs-btn-primary vs-btn-sm">
                  Save Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Bills & Usage Modal */}
      {ledgerModalOpen && (
        <div className="vs-modal-backdrop" onClick={() => setLedgerModalOpen(false)}>
          <div className="vs-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Coins size={19} style={{ color: 'var(--accent-brand)' }} />
                <div>
                  <h3 className="vs-h3">Credits Bills & Usage</h3>
                  <p style={{ fontSize: '0.79rem', color: 'var(--text-muted)' }}>
                    Plan: <strong style={{ textTransform: 'uppercase', color: '#fff' }}>{user.plan}</strong> · Balance: <strong style={{ color: '#fff' }}>{user.credits} credits</strong>
                  </p>
                </div>
              </div>
              <button type="button" className="vs-btn-ghost" onClick={() => setLedgerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
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
                  <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#fff' }}>+{item.pack} Credits</div>
                  <div style={{ fontSize: '0.76rem', color: '#a59eff', marginTop: 2 }}>Top Up · {item.price}</div>
                </button>
              ))}
            </div>

            <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid var(--border-hairline)', borderRadius: 12 }}>
              {ledger.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--border-hairline)',
                    fontSize: '0.82rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 550 }}>{tx.description}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: tx.amount >= 0 ? 'var(--accent-teal)' : '#a59eff',
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
