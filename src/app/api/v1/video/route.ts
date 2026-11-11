import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAllAvatars, ProjectRecord, readDB, verifyApiKey, writeDB } from '@/lib/db';
import {
  AspectRatioOption,
  calculateCredits,
  estimateScriptDurationSec,
  ResolutionOption,
} from '@/lib/credits';

export async function GET(req: NextRequest) {
  const db = readDB();
  const videoId = req.nextUrl.searchParams.get('video_id');
  if (videoId) {
    const found = db.projects.find((p) => p.id === videoId);
    if (!found) {
      return NextResponse.json({ error: 'Video job not found' }, { status: 404 });
    }
    return NextResponse.json({
      video_id: found.id,
      status: found.status,
      model_id: found.modelId,
      avatar_id: found.avatarId,
      voice_id: found.voiceId,
      resolution: found.resolution,
      aspect_ratio: found.aspectRatio,
      duration_sec: found.durationSec,
      credits_used: found.creditsUsed,
      studio_url: `/studio?project=${found.id}`,
      created_at: found.createdAt,
    });
  }
  return NextResponse.json({
    videos: db.projects.slice(0, 20).map((p) => ({
      video_id: p.id,
      title: p.title,
      status: p.status,
      resolution: p.resolution,
      duration_sec: p.durationSec,
      credits_used: p.creditsUsed,
      created_at: p.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const db = readDB();
  const apiKey = req.headers.get('x-api-key');
  if (apiKey && !verifyApiKey(db, apiKey)) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid X-API-Key header' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const textScript = String(body.text_script || body.text || '').trim();
  const audioScript = String(body.audio_script || '').trim();

  if (!textScript && !audioScript) {
    return NextResponse.json(
      { error: 'Provide either text_script or audio_script in request payload' },
      { status: 400 }
    );
  }

  const resolution = (body.resolution as ResolutionOption) || '720p';
  const aspectRatio = (body.aspect_ratio as AspectRatioOption) || '16:9';
  const modelId = String(body.model_id || 'vs_character_v4');
  const durationSec = textScript ? estimateScriptDurationSec(textScript, 'normal') : 8;

  const bill = calculateCredits({
    workflow: 'ai-video',
    durationSec,
    resolution,
    greenScreen: Boolean(body.green_screen),
    modelId,
  });

  if (db.user.credits < bill.totalCredits) {
    return NextResponse.json(
      {
        error: 'Insufficient credits balance',
        required_credits: bill.totalCredits,
        credits_balance: db.user.credits,
      },
      { status: 402 }
    );
  }

  const now = new Date().toISOString();
  db.user.credits -= bill.totalCredits;
  db.ledger.push({
    id: `tx_${crypto.randomBytes(4).toString('hex')}`,
    createdAt: now,
    type: 'generation_spend',
    amount: -bill.totalCredits,
    description: `OpenAPI POST /api/v1/video (${modelId}, ${resolution})`,
    balanceAfter: db.user.credits,
  });

  const avatars = getAllAvatars(db);
  const avatar = avatars.find((a) => a.id === body.avatar_id) || avatars[0];

  const videoId = `vs_${crypto.randomBytes(6).toString('hex')}`;
  const project: ProjectRecord = {
    id: videoId,
    title: textScript ? textScript.slice(0, 60) : 'Audio Script Avatar Video',
    workflow: 'ai-video',
    mode: 'presenter',
    modelId,
    avatarId: avatar.id,
    avatarImage: avatar.image,
    voiceId: String(body.voice_id || avatar.defaultVoiceId),
    script: textScript || `Audio-driven performance from ${audioScript}`,
    resolution,
    aspectRatio,
    greenScreen: Boolean(body.green_screen),
    speed: 'normal',
    durationSec,
    creditsUsed: bill.totalCredits,
    status: 'created',
    createdAt: now,
    updatedAt: now,
  };

  db.projects.unshift(project);
  writeDB(db);

  return NextResponse.json({
    video_id: videoId,
    status: 'created',
    model_id: modelId,
    avatar_id: avatar.id,
    voice_id: project.voiceId,
    resolution,
    aspect_ratio: aspectRatio,
    duration_sec: durationSec,
    credits_used: bill.totalCredits,
    credits_remaining: db.user.credits,
    studio_playback_url: `/studio?project=${videoId}`,
    retention_days: 7,
  });
}
