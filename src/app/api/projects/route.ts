import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAllAvatars, ProjectRecord, readDB, writeDB } from '@/lib/db';
import {
  AspectRatioOption,
  calculateCredits,
  estimateScriptDurationSec,
  ResolutionOption,
  StudioWorkflowType,
} from '@/lib/credits';

export async function GET() {
  const db = readDB();
  return NextResponse.json({ projects: db.projects });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDB();
  const now = new Date().toISOString();

  const workflow = (body.workflow as StudioWorkflowType) || 'ai-video';
  const resolution = (body.resolution as ResolutionOption) || '720p';
  const aspectRatio = (body.aspectRatio as AspectRatioOption) || '9:16';
  const speed = (body.speed as 'slow' | 'normal' | 'fast') || 'normal';
  const script = String(body.script || '').trim();
  const greenScreen = Boolean(body.greenScreen);
  const mode = (body.mode as 'presenter' | 'cinematic') || 'presenter';

  const durationSec =
    Number(body.durationSec) > 0
      ? Number(body.durationSec)
      : Math.max(5, estimateScriptDurationSec(script || 'VisionStory AI Video', speed));

  const bill = calculateCredits({
    workflow,
    durationSec,
    resolution,
    greenScreen,
    cinematicMode: mode === 'cinematic',
    modelId: body.modelId,
    slidesCount: Array.isArray(body.shots) ? body.shots.length : undefined,
  });

  // Auto Recharge support if enabled on paid plan and balance would dip below threshold
  if (
    db.user.autoRecharge &&
    db.user.plan !== 'free' &&
    db.user.credits - bill.totalCredits < db.user.autoRechargeThreshold
  ) {
    const pack = db.user.autoRechargePack || 100;
    db.user.credits += pack;
    db.ledger.push({
      id: `tx_${crypto.randomBytes(4).toString('hex')}`,
      createdAt: now,
      type: 'credit_pack',
      amount: pack,
      description: `Auto Recharge triggered (+${pack} permanent credits)`,
      balanceAfter: db.user.credits,
    });
  }

  if (db.user.credits < bill.totalCredits) {
    return NextResponse.json(
      {
        error: `Insufficient credits: requires ${bill.totalCredits} credits, you have ${db.user.credits}. Claim your Weekly Bonus or upgrade your plan!`,
        requiredCredits: bill.totalCredits,
        availableCredits: db.user.credits,
      },
      { status: 402 }
    );
  }

  if (bill.totalCredits > 0) {
    db.user.credits -= bill.totalCredits;
    db.ledger.push({
      id: `tx_${crypto.randomBytes(4).toString('hex')}`,
      createdAt: now,
      type: 'generation_spend',
      amount: -bill.totalCredits,
      description: `Generated ${workflow.toUpperCase()} (${resolution}, ${durationSec}s) · ${bill.formulaNoteEn}`,
      balanceAfter: db.user.credits,
    });
  }

  const avatars = getAllAvatars(db);
  const chosenAvatar =
    avatars.find((a) => a.id === body.avatarId) || avatars[0];
  const secondaryAvatar = body.secondaryAvatarId
    ? avatars.find((a) => a.id === body.secondaryAvatarId)
    : undefined;

  const project: ProjectRecord = {
    id: `vs_${crypto.randomBytes(5).toString('hex')}`,
    title:
      String(body.title || '').trim() ||
      (script ? script.slice(0, 64) : `VisionStory ${workflow.toUpperCase()} Video`),
    workflow,
    mode,
    modelId: String(body.modelId || 'vs_character_v4'),
    avatarId: chosenAvatar.id,
    secondaryAvatarId: secondaryAvatar?.id,
    avatarImage: String(body.avatarImage || chosenAvatar.image),
    secondaryAvatarImage: body.secondaryAvatarImage || secondaryAvatar?.image,
    voiceId: String(body.voiceId || chosenAvatar.defaultVoiceId || 'voice_alloy'),
    secondaryVoiceId: body.secondaryVoiceId,
    script:
      script ||
      'Generated with VisionStory AI Studio — expressive motion, accurate lip-sync, and studio-grade clarity.',
    motionPrompt: body.motionPrompt ? String(body.motionPrompt) : undefined,
    resolution,
    aspectRatio,
    greenScreen,
    speed,
    durationSec,
    creditsUsed: bill.totalCredits,
    status: 'created',
    createdAt: now,
    updatedAt: now,
    shots: Array.isArray(body.shots) ? body.shots : undefined,
    musicStyle: body.musicStyle,
    stageTheme: body.stageTheme,
  };

  db.projects.unshift(project);
  writeDB(db);

  return NextResponse.json({
    ok: true,
    project,
    creditsRemaining: db.user.credits,
    bill,
  });
}
