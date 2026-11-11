export type ResolutionOption = '720p' | '1080p' | '2K';
export type AspectRatioOption = '9:16' | '16:9' | '1:1';
export type StudioWorkflowType =
  | 'ai-video'
  | 'ai-agent'
  | 'viral-music'
  | 'face-swap'
  | 'seedance'
  | 'podcast'
  | 'presentation'
  | 'ai-tools';

export interface CreditBreakdown {
  workflow: StudioWorkflowType;
  estimatedDurationSec: number;
  intervals: number;
  baseCredits: number;
  resolutionAddonCredits: number;
  greenScreenAddonCredits: number;
  cinematicAddonCredits: number;
  totalCredits: number;
  formulaNoteEn: string;
  formulaNoteVi: string;
}

/**
 * Implements VisionStory's official credit calculation formula:
 * - V-Character 4.0 Presenter talking video costs 1 credit per 4-second interval at 720p,
 *   with partial intervals rounded up.
 * - 1080p adds 0.5x base credits (rounded up separately).
 * - 2K adds 2.5x base credits (rounded up separately).
 * - Green Screen adds 0.25x base credits (rounded up separately).
 * - Cinematic mode (V-Character 5.0 Pro) adds 0.5x base credits.
 * - Face Swap is Free (0 credits).
 * - External video models (Seedance 2.5, Kling O3, MiniMax H3, Wan 3.0) bill per second.
 */
export function calculateCredits(params: {
  workflow: StudioWorkflowType;
  durationSec: number;
  resolution?: ResolutionOption;
  greenScreen?: boolean;
  cinematicMode?: boolean;
  modelId?: string;
  slidesCount?: number;
}): CreditBreakdown {
  const duration = Math.max(0, Math.ceil(params.durationSec));
  const resolution = params.resolution ?? '720p';
  const greenScreen = Boolean(params.greenScreen);
  const cinematicMode = Boolean(params.cinematicMode);

  if (params.workflow === 'face-swap') {
    return {
      workflow: 'face-swap',
      estimatedDurationSec: Math.max(duration, 8),
      intervals: 0,
      baseCredits: 0,
      resolutionAddonCredits: 0,
      greenScreenAddonCredits: 0,
      cinematicAddonCredits: 0,
      totalCredits: 0,
      formulaNoteEn: 'Free HD Face Swap · 0 credits, no watermark',
      formulaNoteVi: 'Hoán đổi khuôn mặt HD miễn phí · 0 credit, không watermark',
    };
  }

  if (params.workflow === 'seedance') {
    const sec = Math.max(duration, 5);
    const rateMap: Record<string, number> = {
      'seedance-2.5': 2,
      'kling-o3': 3,
      'minimax-h3': 2,
      'wan-3.0': 1.5,
    };
    const perSec = rateMap[params.modelId ?? 'seedance-2.5'] ?? 2;
    const base = Math.ceil(sec * perSec);
    const resAddon = resolution === '2K' ? Math.ceil(base * 0.5) : 0;
    return {
      workflow: 'seedance',
      estimatedDurationSec: sec,
      intervals: sec,
      baseCredits: base,
      resolutionAddonCredits: resAddon,
      greenScreenAddonCredits: 0,
      cinematicAddonCredits: 0,
      totalCredits: base + resAddon,
      formulaNoteEn: `${perSec} credits/sec × ${sec}s${resAddon ? ` + ${resAddon} (2K)` : ''}`,
      formulaNoteVi: `${perSec} credits/giây × ${sec}s${resAddon ? ` + ${resAddon} (2K)` : ''}`,
    };
  }

  if (params.workflow === 'ai-tools') {
    return {
      workflow: 'ai-tools',
      estimatedDurationSec: duration || 1,
      intervals: 1,
      baseCredits: 1,
      resolutionAddonCredits: 0,
      greenScreenAddonCredits: 0,
      cinematicAddonCredits: 0,
      totalCredits: 1,
      formulaNoteEn: '1 credit per AI Tool generation (Free for local enhancers)',
      formulaNoteVi: '1 credit mỗi lượt tạo AI Tool (Miễn phí cho công cụ xử lý cục bộ)',
    };
  }

  if (duration === 0) {
    return {
      workflow: params.workflow,
      estimatedDurationSec: 0,
      intervals: 0,
      baseCredits: 0,
      resolutionAddonCredits: 0,
      greenScreenAddonCredits: 0,
      cinematicAddonCredits: 0,
      totalCredits: 0,
      formulaNoteEn: '1 credit per 4-second interval at 720p',
      formulaNoteVi: '1 credit cho mỗi khoảng 4 giây ở 720p',
    };
  }

  const intervals = Math.ceil(duration / 4);
  let baseCredits = intervals;

  if (params.workflow === 'viral-music') {
    baseCredits = Math.ceil(intervals * 1.5);
  } else if (params.workflow === 'podcast') {
    baseCredits = Math.ceil(intervals * 1.25);
  } else if (params.workflow === 'presentation') {
    const slideFactor = Math.max(1, params.slidesCount ?? 3);
    baseCredits = Math.max(intervals, slideFactor);
  }

  const resolutionAddonCredits =
    resolution === '1080p'
      ? Math.ceil(baseCredits * 0.5)
      : resolution === '2K'
      ? Math.ceil(baseCredits * 2.5)
      : 0;

  const greenScreenAddonCredits = greenScreen ? Math.ceil(baseCredits * 0.25) : 0;
  const cinematicAddonCredits = cinematicMode ? Math.ceil(baseCredits * 0.5) : 0;

  const totalCredits =
    baseCredits + resolutionAddonCredits + greenScreenAddonCredits + cinematicAddonCredits;

  return {
    workflow: params.workflow,
    estimatedDurationSec: duration,
    intervals,
    baseCredits,
    resolutionAddonCredits,
    greenScreenAddonCredits,
    cinematicAddonCredits,
    totalCredits,
    formulaNoteEn: `${intervals} × 4s interval(s) = ${baseCredits} base${
      resolutionAddonCredits ? ` + ${resolutionAddonCredits} (${resolution})` : ''
    }${greenScreenAddonCredits ? ` + ${greenScreenAddonCredits} (Green Screen)` : ''}${
      cinematicAddonCredits ? ` + ${cinematicAddonCredits} (Cinematic)` : ''
    }`,
    formulaNoteVi: `${intervals} khoảng × 4s = ${baseCredits} gốc${
      resolutionAddonCredits ? ` + ${resolutionAddonCredits} (${resolution})` : ''
    }${greenScreenAddonCredits ? ` + ${greenScreenAddonCredits} (Phông xanh)` : ''}${
      cinematicAddonCredits ? ` + ${cinematicAddonCredits} (Điện ảnh)` : ''
    }`,
  };
}

export function estimateScriptDurationSec(text: string, speed: 'slow' | 'normal' | 'fast' = 'normal'): number {
  const cleaned = text.trim();
  if (!cleaned) return 0;
  const words = cleaned.split(/\s+/).filter(Boolean).length;
  const wpm = speed === 'slow' ? 115 : speed === 'fast' ? 165 : 140;
  return Math.max(4, Math.ceil((words / wpm) * 60));
}
