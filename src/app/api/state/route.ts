import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  createApiKey,
  getAllAvatars,
  getAllVoices,
  readDB,
  writeDB,
} from '@/lib/db';
import { PRICING_PLANS, StockAvatar, VoiceOption } from '@/lib/catalog';

export async function GET() {
  const db = readDB();
  return NextResponse.json({
    user: db.user,
    avatars: getAllAvatars(db),
    voices: getAllVoices(db),
    projects: db.projects,
    ledger: db.ledger.slice().reverse(),
    apiKeys: db.apiKeys.map((k) => ({
      id: k.id,
      name: k.name,
      rawPreview: k.rawPreview,
      createdAt: k.createdAt,
    })),
    providerKeysConfigured: {
      openai: Boolean(db.providerKeys.openaiApiKey || process.env.OPENAI_API_KEY),
      gemini: Boolean(db.providerKeys.geminiApiKey || process.env.GEMINI_API_KEY),
      elevenlabs: Boolean(db.providerKeys.elevenlabsApiKey || process.env.ELEVENLABS_API_KEY),
      replicate: Boolean(db.providerKeys.replicateApiToken || process.env.REPLICATE_API_TOKEN),
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDB();
  const now = new Date().toISOString();

  switch (body.action) {
    case 'login': {
      const name = String(body.name || 'Creator').trim();
      const email = String(body.email || 'creator@visionstory.ai').trim();
      const provider = body.provider || 'email';
      db.user.name = name || email.split('@')[0];
      db.user.email = email;
      db.user.provider = provider;
      writeDB(db);
      return NextResponse.json({ ok: true, user: db.user });
    }

    case 'claim_weekly_bonus': {
      const planInfo = PRICING_PLANS.find((p) => p.id === db.user.plan) || PRICING_PLANS[0];
      const bonus = planInfo.weeklyBonus;
      db.user.credits += bonus;
      db.user.lastWeeklyBonusClaimedAt = now;
      db.ledger.push({
        id: `tx_${crypto.randomBytes(4).toString('hex')}`,
        createdAt: now,
        type: 'weekly_bonus',
        amount: bonus,
        description: `Weekly Visit Bonus (${planInfo.name} tier +${bonus} credits)`,
        balanceAfter: db.user.credits,
      });
      writeDB(db);
      return NextResponse.json({ ok: true, credits: db.user.credits, bonus });
    }

    case 'upgrade_plan': {
      const targetPlanId = body.planId as 'free' | 'pro' | 'advanced' | 'ultra';
      const billingCycle = (body.billingCycle as 'monthly' | 'annual') || 'monthly';
      const planInfo = PRICING_PLANS.find((p) => p.id === targetPlanId);
      if (!planInfo) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
      }
      db.user.plan = targetPlanId;
      db.user.billingCycle = billingCycle;
      const grant =
        targetPlanId === 'free'
          ? 0
          : billingCycle === 'annual'
          ? planInfo.annualCredits
          : planInfo.monthlyCredits;
      if (grant > 0) {
        db.user.credits += grant;
        db.ledger.push({
          id: `tx_${crypto.randomBytes(4).toString('hex')}`,
          createdAt: now,
          type: 'plan_upgrade',
          amount: grant,
          description: `Subscribed to ${planInfo.name} (${billingCycle}) · +${grant} credits`,
          balanceAfter: db.user.credits,
        });
      }
      writeDB(db);
      return NextResponse.json({ ok: true, user: db.user });
    }

    case 'buy_credits': {
      const packCredits = Math.max(10, Number(body.credits) || 100);
      db.user.credits += packCredits;
      db.ledger.push({
        id: `tx_${crypto.randomBytes(4).toString('hex')}`,
        createdAt: now,
        type: 'credit_pack',
        amount: packCredits,
        description: `One-time Permanent Credit Pack (+${packCredits} credits · never expires)`,
        balanceAfter: db.user.credits,
      });
      writeDB(db);
      return NextResponse.json({ ok: true, credits: db.user.credits });
    }

    case 'toggle_auto_recharge': {
      db.user.autoRecharge = Boolean(body.enabled);
      if (body.threshold) db.user.autoRechargeThreshold = Number(body.threshold);
      if (body.pack) db.user.autoRechargePack = Number(body.pack);
      writeDB(db);
      return NextResponse.json({ ok: true, user: db.user });
    }

    case 'add_custom_avatar': {
      const name = String(body.name || 'Custom Portrait').trim();
      const image = String(body.image || '/assets/avatars/aria.jpg');
      const newAvatar: StockAvatar = {
        id: `av_custom_${crypto.randomBytes(4).toString('hex')}`,
        name,
        role: 'Custom Uploaded Avatar',
        roleVi: 'Avatar Tải Lên Cá Nhân',
        category: 'presenter',
        image,
        defaultVoiceId: 'voice_alloy',
        languages: 88,
        styleTag: 'Custom V4',
        accentColor: '#625df5',
      };
      db.customAvatars.unshift(newAvatar);
      writeDB(db);
      return NextResponse.json({ ok: true, avatar: newAvatar, avatars: getAllAvatars(db) });
    }

    case 'clone_voice': {
      const name = String(body.name || 'My Cloned Voice').trim();
      const languageCode = String(body.languageCode || 'en-US');
      const gender = (body.gender as 'Female' | 'Male' | 'Neutral') || 'Female';
      const cloned: VoiceOption = {
        id: `voice_clone_${crypto.randomBytes(4).toString('hex')}`,
        name: `${name} (Cloned)`,
        language: languageCode.startsWith('vi') ? 'Tiếng Việt (Cloned)' : `${languageCode} (Cloned)`,
        languageCode,
        gender,
        style: 'Instant Neural Voice Clone · Personal Brand',
        styleVi: 'Giọng nhân bản AI cá nhân · Thương hiệu riêng',
        pitch: Number(body.pitch) || 1.0,
        rate: 1.0,
        isCloned: true,
        sampleText:
          languageCode.startsWith('vi')
            ? `Xin chào, đây là giọng nói nhân bản ${name} trên nền tảng VisionStory AI.`
            : `Hi there, this is my cloned voice ${name} generated on VisionStory AI.`,
      };
      db.clonedVoices.unshift(cloned);
      writeDB(db);
      return NextResponse.json({ ok: true, voice: cloned, voices: getAllVoices(db) });
    }

    case 'save_provider_keys': {
      if (typeof body.openaiApiKey === 'string') {
        db.providerKeys.openaiApiKey = body.openaiApiKey.trim() || undefined;
      }
      if (typeof body.geminiApiKey === 'string') {
        db.providerKeys.geminiApiKey = body.geminiApiKey.trim() || undefined;
      }
      if (typeof body.elevenlabsApiKey === 'string') {
        db.providerKeys.elevenlabsApiKey = body.elevenlabsApiKey.trim() || undefined;
      }
      if (typeof body.replicateApiToken === 'string') {
        db.providerKeys.replicateApiToken = body.replicateApiToken.trim() || undefined;
      }
      writeDB(db);
      return NextResponse.json({
        ok: true,
        providerKeysConfigured: {
          openai: Boolean(db.providerKeys.openaiApiKey || process.env.OPENAI_API_KEY),
          gemini: Boolean(db.providerKeys.geminiApiKey || process.env.GEMINI_API_KEY),
          elevenlabs: Boolean(db.providerKeys.elevenlabsApiKey || process.env.ELEVENLABS_API_KEY),
          replicate: Boolean(db.providerKeys.replicateApiToken || process.env.REPLICATE_API_TOKEN),
        },
      });
    }

    case 'create_api_key': {
      const { record, rawKey } = createApiKey(String(body.name || 'Production Key'));
      db.apiKeys.unshift(record);
      writeDB(db);
      return NextResponse.json({
        ok: true,
        rawKey,
        apiKeys: db.apiKeys.map((k) => ({
          id: k.id,
          name: k.name,
          rawPreview: k.rawPreview,
          createdAt: k.createdAt,
        })),
      });
    }

    case 'revoke_api_key': {
      db.apiKeys = db.apiKeys.filter((k) => k.id !== body.keyId);
      writeDB(db);
      return NextResponse.json({
        ok: true,
        apiKeys: db.apiKeys.map((k) => ({
          id: k.id,
          name: k.name,
          rawPreview: k.rawPreview,
          createdAt: k.createdAt,
        })),
      });
    }

    case 'delete_project': {
      db.projects = db.projects.filter((p) => p.id !== body.projectId);
      writeDB(db);
      return NextResponse.json({ ok: true, projects: db.projects });
    }

    default:
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  }
}
