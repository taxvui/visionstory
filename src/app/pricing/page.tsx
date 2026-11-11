'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, Coins, RefreshCw, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/catalog';
import { calculateCredits, ResolutionOption } from '@/lib/credits';
import { useVisionStory } from '@/components/VisionStoryProvider';
import { Footer } from '@/components/Footer';

const PRICING_FAQS = [
  {
    q: 'Can I start using VisionStory for free?',
    a: 'Yes. Eligible new accounts receive 10 sign-up credits, plus a Weekly Visit Bonus in each week you visit — 4 credits on Free, 8 on Pro, 20 on Advanced, and 60 on Ultra.',
  },
  {
    q: 'What are credits and how are they used?',
    a: 'V-Character 4.0 Presenter video costs 1 credit per 4-second interval at 720p, with partial intervals rounded up. 1080p adds 0.5× base credits, 2K adds 2.5× base credits, and Green Screen adds 0.25× base credits, each rounded up separately.',
  },
  {
    q: 'What happens to unused credits?',
    a: 'Unused Subscription credits carry over up to 2× the renewing plan’s monthly-equivalent allowance while your subscription stays active. One-time purchased credit packs and sign-up bonus credits never expire.',
  },
  {
    q: 'Can I switch between monthly and annual billing?',
    a: 'Yes. Annual billing is priced at the equivalent of 10 monthly payments (giving you 2 months free), and the full year’s credits are allocated upfront.',
  },
  {
    q: 'What is Auto Recharge?',
    a: 'Auto Recharge automatically purchases your chosen permanent credit pack whenever your paid balance dips below your threshold. You can toggle it anytime below.',
  },
];

export default function PricingPage() {
  const { locale, user, refreshState, showToast, setLedgerModalOpen } = useVisionStory();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [calcSeconds, setCalcSeconds] = useState<number>(32);
  const [calcRes, setCalcRes] = useState<ResolutionOption>('1080p');
  const [calcGs, setCalcGs] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sampleBill = calculateCredits({
    workflow: 'ai-video',
    durationSec: calcSeconds,
    resolution: calcRes,
    greenScreen: calcGs,
  });

  const handleSubscribe = async (planId: 'free' | 'pro' | 'advanced' | 'ultra') => {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'upgrade_plan',
        planId,
        billingCycle: billing,
      }),
    });
    if (res.ok) {
      await refreshState();
      showToast(
        locale === 'vi'
          ? `Đã kích hoạt gói ${planId.toUpperCase()} (${billing}) và cộng credits vào tài khoản!`
          : `Activated ${planId.toUpperCase()} (${billing}) plan & issued subscription credits!`
      );
    }
  };

  const handleToggleAutoRecharge = async () => {
    const next = !user.autoRecharge;
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_auto_recharge', enabled: next }),
    });
    await refreshState();
    showToast(next ? 'Enabled Auto Recharge (+100 credits below 10 cr)' : 'Disabled Auto Recharge');
  };

  return (
    <main>
      <section className="vs-section" style={{ paddingTop: 64 }}>
        <div className="vs-container">
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 38px' }}>
            <span className="vs-eyebrow">Simple, transparent pricing</span>
            <h1 className="vs-h1" style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)', marginBottom: 14 }}>
              {locale === 'vi' ? 'Bảng Giá Gói Cước AI Video' : 'AI Video Pricing Plans'}
            </h1>
            <p className="vs-lead" style={{ margin: '0 auto 24px' }}>
              {locale === 'vi'
                ? 'Bắt đầu miễn phí, nâng cấp linh hoạt theo nhu cầu sản xuất — mọi gói trả phí đều được cộng dồn credits sang chu kỳ sau.'
                : 'Start free, then choose a plan that fits your production volume — unused credits carry over up to 2× between billing cycles.'}
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="vs-segmented">
              <button
                type="button"
                className={`vs-segmented-btn ${billing === 'monthly' ? 'active' : ''}`}
                onClick={() => setBilling('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`vs-segmented-btn ${billing === 'annual' ? 'active' : ''}`}
                onClick={() => setBilling('annual')}
              >
                Annually · Save 2 Months
              </button>
            </div>
          </div>

          {/* 4 PRICING TIERS */}
          <div className="vs-grid-4" style={{ marginBottom: 48 }}>
            {PRICING_PLANS.map((plan) => {
              const isCurrent = user.plan === plan.id;
              const priceDisplay =
                plan.id === 'free'
                  ? '$0'
                  : billing === 'annual'
                  ? `$${plan.annualMonthlyEquivalent.toFixed(2)}`
                  : `$${plan.monthlyPrice}`;
              const creditsDisplay =
                billing === 'annual' && plan.id !== 'free'
                  ? `${plan.annualCredits.toLocaleString()} credits/yr`
                  : `${plan.monthlyCredits.toLocaleString()} credits/mo`;

              return (
                <div
                  key={plan.id}
                  className="vs-card"
                  style={{
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    borderColor: plan.popular ? 'var(--accent-brand)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 750 }}>{plan.name}</h2>
                    {plan.popular && <span className="vs-tag vs-tag-brand">Most Popular</span>}
                  </div>

                  <div>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                      {priceDisplay}
                    </span>
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}> /mo</span>
                    {billing === 'annual' && plan.annualTotal > 0 && (
                      <div style={{ fontSize: '0.76rem', color: 'var(--accent-teal)', marginTop: 2 }}>
                        Billed ${plan.annualTotal}/yr (2 months free)
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.84rem',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{creditsDisplay}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{plan.approxMinutes}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubscribe(plan.id)}
                    className={
                      plan.popular
                        ? 'vs-btn vs-btn-primary'
                        : 'vs-btn vs-btn-secondary'
                    }
                    style={{ width: '100%' }}
                  >
                    <Sparkles size={15} />
                    <span>
                      {isCurrent
                        ? `Current Plan (${plan.name})`
                        : plan.id === 'free'
                        ? 'Get Started Free'
                        : `Subscribe to ${plan.name}`}
                    </span>
                  </button>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, fontSize: '0.84rem', color: 'var(--text-secondary)', flex: 1 }}>
                    {(locale === 'vi' ? plan.featuresVi : plan.featuresEn).map((feat) => (
                      <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Check size={15} style={{ color: 'var(--accent-teal)', marginTop: 3, flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* INTERACTIVE CREDIT ESTIMATOR + AUTO RECHARGE BAR */}
          <div className="vs-grid-2" style={{ marginBottom: 60 }}>
            <div className="vs-card" style={{ padding: 24 }}>
              <h3 className="vs-h3" style={{ marginBottom: 8 }}>
                Interactive Credit Cost Calculator (V-Character 4.0)
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Preview exact interval rounding before submitting any generation job.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span>Video Duration</span>
                    <strong>{calcSeconds} seconds ({Math.ceil(calcSeconds / 4)} × 4s intervals)</strong>
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={180}
                    step={4}
                    value={calcSeconds}
                    onChange={(e) => setCalcSeconds(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div className="vs-segmented">
                    {(['720p', '1080p', '2K'] as ResolutionOption[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`vs-segmented-btn ${calcRes === r ? 'active' : ''}`}
                        onClick={() => setCalcRes(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.84rem' }}>
                    <input
                      type="checkbox"
                      checked={calcGs}
                      onChange={(e) => setCalcGs(e.target.checked)}
                    />
                    Green Screen (+0.25×)
                  </label>

                  <div className="vs-tag vs-tag-brand" style={{ fontSize: '0.9rem', padding: '7px 14px' }}>
                    Estimated: {sampleBill.totalCredits} credits
                  </div>
                </div>
              </div>
            </div>

            <div className="vs-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              <div>
                <h3 className="vs-h3" style={{ marginBottom: 8 }}>
                  Auto Recharge & Permanent Credit Packs
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Purchased credit packs never expire and are immune to monthly rollover caps. Enable Auto Recharge on any paid subscription so automated API/Studio batches never pause.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button type="button" className="vs-btn vs-btn-secondary" onClick={handleToggleAutoRecharge}>
                  <RefreshCw size={15} />
                  <span>Auto Recharge: {user.autoRecharge ? 'ON' : 'OFF'}</span>
                </button>
                <button type="button" className="vs-btn vs-btn-primary" onClick={() => setLedgerModalOpen(true)}>
                  <Coins size={15} />
                  <span>Buy Extra Credits / View Ledger</span>
                </button>
              </div>
            </div>
          </div>

          {/* COMPARE PLANS MATRIX TABLE */}
          <h2 className="vs-h2" style={{ marginBottom: 20 }}>Compare Plans and Features</h2>
          <div className="vs-table-wrap" style={{ marginBottom: 64 }}>
            <table className="vs-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free ($0)</th>
                  <th>Pro ($9.99)</th>
                  <th style={{ color: 'var(--accent-brand)' }}>Advanced ($29.9)</th>
                  <th>Ultra ($99.9)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Monthly Credits', '10 credits (≈1m)', '120 credits (≈8m)', '480 credits (≈32m)', '1,920 credits (≈128m)'],
                  ['Max Single Video Length', '30 seconds', '10 minutes', '10 minutes', '10 minutes'],
                  ['Export Resolution', '720p', '720p', '720p, 1080p, 2K', '720p, 1080p, 2K, 4K'],
                  ['Weekly Visit Bonus', '4 credits', '8 credits', '20 credits', '60 credits'],
                  ['Concurrent Tasks & Priority', '1 · Low', '10 · Express', '10 · Express', '10 · Express'],
                  ['AI Presentation Slides', 'Preview', '20 Slides', '50 Slides', '100 Slides'],
                  ['Custom Avatars', '2 only', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['Voice Cloning Slots', '—', '10 Voices', '20 Voices', '50 Voices'],
                  ['Watermark-Free & Commercial Use', '—', '✓ Included', '✓ Included', '✓ Included'],
                  ['Seedance 2.5, AI Agent & Podcast', 'Preview', '✓ Full Access', '✓ Full Access', '✓ Full Access'],
                ].map(([label, c1, c2, c3, c4]) => (
                  <tr key={label}>
                    <td style={{ fontWeight: 600 }}>{label}</td>
                    <td>{c1}</td>
                    <td>{c2}</td>
                    <td style={{ fontWeight: 650, color: 'var(--text-primary)' }}>{c3}</td>
                    <td>{c4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PRICING FAQ */}
          <div id="faq" style={{ maxWidth: 820, margin: '0 auto' }}>
            <h2 className="vs-h2" style={{ textAlign: 'center', marginBottom: 26 }}>Pricing FAQ</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PRICING_FAQS.map((item, idx) => (
                <div key={item.q} className="vs-card" style={{ padding: '16px 20px' }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', fontWeight: 650 }}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={17} />
                  </button>
                  {openFaq === idx && (
                    <p style={{ marginTop: 10, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
