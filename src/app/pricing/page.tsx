'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRICING_PLANS, PricingPlan } from '@/lib/catalog';
import { useVisionStory } from '@/components/VisionStoryProvider';
import { Footer } from '@/components/Footer';

function PurpleCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M3.6 8.0L7.1 11.2L13.2 4.8" stroke="#605CF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MatrixCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#625df5',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.68rem',
          fontWeight: 800,
        }}
      >
        ✓
      </span>
    ) : (
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.22)',
          color: '#0d0e14',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 900,
        }}
      >
        ×
      </span>
    );
  }
  return <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.78)' }}>{value}</span>;
}

export default function PricingPage() {
  const { user, refreshState, showToast } = useVisionStory();
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');
  const [ultraTier, setUltraTier] = useState<'1920' | '5760'>('1920');

  const handleSelectPlan = async (plan: PricingPlan) => {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'upgrade_plan',
        plan: plan.id,
        billingCycle: cycle,
      }),
    });
    if (res.ok) {
      await refreshState();
      showToast(`Activated ${plan.name} (${cycle}) plan on your account!`);
    }
  };

  return (
    <main
      style={{
        background:
          'radial-gradient(ellipse 68% 36% at 50% 0%, rgba(56, 51, 168, 0.34) 0%, rgba(16, 18, 40, 0.14) 52%, #000000 100%)',
      }}
    >
      <section className="vs-container" style={{ paddingTop: 28, paddingBottom: 40 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 24 }}>
          <Link href="/">Home</Link> <span style={{ margin: '0 6px' }}>›</span> <span style={{ color: '#fff' }}>Pricing</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 42px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '5px 14px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.04)',
              fontSize: '0.76rem',
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Simple, transparent pricing
          </span>
          <h1 className="vs-h1" style={{ marginBottom: 14 }}>AI Video Pricing Plans</h1>
          <p className="vs-lead" style={{ fontSize: '0.96rem' }}>
            Create more, pay only for what you need. Start free, then choose a plan that fits your production volume — every paid plan includes premium AI video features and credits that carry over between billing cycles.
          </p>
        </div>

        {/* Choose Your Plan + Monthly / Annually Pill Toggle */}
        <div style={{ marginBottom: 46 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 10 }}>Choose Your Plan</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="vs-mode-pill-group">
              <button
                type="button"
                className={`vs-mode-pill-btn ${cycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setCycle('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`vs-mode-pill-btn ${cycle === 'annual' ? 'active' : ''}`}
                onClick={() => setCycle('annual')}
              >
                <span>Annually</span>
                <span style={{ color: '#f43f5e', fontSize: '0.74rem', fontWeight: 700 }}>save 2 months</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Plan Cards matching marketing_pricing_tall.png 1:1 */}
        <div className="vs-grid-4" style={{ alignItems: 'stretch', marginBottom: 88 }}>
          {PRICING_PLANS.map((plan) => {
            const basePrice = cycle === 'annual' ? plan.annualMonthlyEquivalent : plan.monthlyPrice;
            const displayPrice = plan.id === 'ultra' && ultraTier === '5760' ? +(basePrice * 2.7).toFixed(1) : basePrice;
            const isCurrent = user.plan === plan.id;

            return (
              <div key={plan.id} className={`vs-plan-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="vs-plan-popular-ribbon">Most Popular</div>}

                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 14 }}>{plan.name}</div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 22 }}>
                  <span style={{ fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                    ${displayPrice}
                  </span>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>/mo</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className="vs-btn vs-btn-white"
                  style={{ width: '100%', height: 42, marginBottom: 14 }}
                >
                  {isCurrent
                    ? 'Current Plan ✓'
                    : plan.id === 'free'
                    ? 'Get Started Free'
                    : 'Subscribe'}
                </button>

                {/* Credits Pill Box */}
                {plan.id === 'ultra' ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      padding: 3,
                      borderRadius: 10,
                      background: '#090a0f',
                      border: '1px solid var(--border-hairline)',
                      marginBottom: 22,
                    }}
                  >
                    {(['1920', '5760'] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setUltraTier(tier)}
                        style={{
                          height: 34,
                          borderRadius: 8,
                          background: ultraTier === tier ? '#1c1e2a' : 'transparent',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: ultraTier === tier ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {tier} credits
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      height: 40,
                      borderRadius: 10,
                      background: '#1c1e29',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 14px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginBottom: 22,
                    }}
                  >
                    {plan.monthlyCredits} credits
                  </div>
                )}

                <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: 10 }}>Video generation:</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
                  {plan.videoGenFeaturesEn.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: '0.8rem', color: 'rgba(255,255,255,0.88)' }}>
                      <PurpleCheck />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: 10 }}>{plan.plusTitleEn}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {plan.plusFeaturesEn.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      <PurpleCheck />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Compare Plans and Features Table (Exact 1:1 match to marketing_pricing_tall.png) */}
        <div id="faq" style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="vs-h2" style={{ marginBottom: 8 }}>Compare Plans and Features</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            All core plan information is visible without signing in.
          </p>
        </div>

        <div
          className="vs-card"
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '28px 28px 18px',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px 24px', fontSize: '0.92rem', width: '26%' }}>Feature</th>
                {PRICING_PLANS.map((p) => (
                  <th key={p.id} style={{ textAlign: 'center', padding: '10px 10px 24px', width: '18.5%' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>
                      ${cycle === 'annual' ? p.annualMonthlyEquivalent : p.monthlyPrice}
                      <span style={{ fontSize: '0.74rem', fontWeight: 500, color: 'var(--text-muted)' }}> /mo</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(p)}
                      className={`vs-btn vs-btn-sm ${p.popular ? 'vs-btn-primary' : 'vs-btn-secondary'}`}
                      style={{ width: '90%' }}
                    >
                      {p.id === 'free' ? 'Get Started Free' : 'Subscribe'}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  group: 'Video Generation',
                  rows: [
                    ['Credits', '10 credits (≈1 minute)', '120 credits (≈8 minutes)', '480 credits (≈30 minutes)', '1920 credits (≈120 minutes)'],
                    ['Maximum Video Length', '30 seconds', '10 minutes', '10 minutes', '10 minutes'],
                    ['Video Resolution', '720p', '720p', '1080P,2K', '1080P,2K'],
                    ['Buy extra credits', false, true, true, true],
                    ['AI Agent', false, true, true, true],
                    ['Video Podcast', false, true, true, true],
                    ['Viral Music', false, true, true, true],
                    ['Face Swap', false, true, true, true],
                    ['AI Tools (Seedance 2.5)', false, true, true, true],
                    ['AI Presentation', false, '20 Slides', '50 Slides', '100 Slides'],
                    ['Weekly Visit Bonus', '4 credits', '8 credits', '20 credits', '60 credits'],
                    ['Concurrent Tasks', '1', '10', '10', '10'],
                    ['Task Priority', 'Low', 'Express', 'Express', 'Express'],
                  ],
                },
                {
                  group: 'Avatars & audio',
                  rows: [
                    ['Clone Voice', false, '10', '20', '50'],
                    ['Custom Avatar', '2 only', 'Unlimited Avatars', 'Unlimited Avatars', 'Unlimited Avatars'],
                    ['Premium Voice', false, true, true, true],
                    ['Preview Audio', false, true, true, true],
                  ],
                },
                {
                  group: 'Creative & commercial',
                  rows: [
                    ['Image Generation', false, true, true, true],
                    ['Watermark-Free', false, true, true, true],
                    ['Commercial Use', false, true, true, true],
                  ],
                },
              ].map((sec) => (
                <React.Fragment key={sec.group}>
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        background: '#191b24',
                        padding: '9px 14px',
                        borderRadius: 8,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                      }}
                    >
                      {sec.group}
                    </td>
                  </tr>
                  {sec.rows.map((row) => (
                    <tr key={String(row[0])} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 12px', fontSize: '0.82rem', fontWeight: 550 }}>{row[0]}</td>
                      {[1, 2, 3, 4].map((colIdx) => (
                        <td key={colIdx} style={{ padding: '14px 10px', textAlign: 'center' }}>
                          <MatrixCell value={row[colIdx] as boolean | string} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </main>
  );
}
