import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { STOCK_AVATARS, VOICE_CATALOG, StockAvatar, VoiceOption } from './catalog';
import { AspectRatioOption, ResolutionOption, StudioWorkflowType } from './credits';

export interface CreditTransaction {
  id: string;
  createdAt: string;
  type: 'signup_bonus' | 'weekly_bonus' | 'plan_upgrade' | 'credit_pack' | 'generation_spend';
  amount: number;
  description: string;
  balanceAfter: number;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  keyHash: string;
  rawPreview: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface ProviderKeysConfig {
  openaiApiKey?: string;
  geminiApiKey?: string;
  elevenlabsApiKey?: string;
  replicateApiToken?: string;
}

export interface StoryboardShot {
  id: string;
  shotNumber: number;
  title: string;
  script: string;
  visualPrompt: string;
  cameraMotion: string;
  durationSec: number;
  speaker?: string;
  avatarId?: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  workflow: StudioWorkflowType;
  mode?: 'presenter' | 'cinematic';
  modelId: string;
  avatarId: string;
  secondaryAvatarId?: string;
  avatarImage: string;
  secondaryAvatarImage?: string;
  voiceId: string;
  secondaryVoiceId?: string;
  script: string;
  motionPrompt?: string;
  resolution: ResolutionOption;
  aspectRatio: AspectRatioOption;
  greenScreen: boolean;
  speed: 'slow' | 'normal' | 'fast';
  durationSec: number;
  creditsUsed: number;
  status: 'queued' | 'creating' | 'created' | 'failed';
  createdAt: string;
  updatedAt: string;
  shots?: StoryboardShot[];
  musicStyle?: string;
  stageTheme?: string;
  videoDataUrl?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  provider: 'demo' | 'email' | 'google' | 'facebook';
  plan: 'free' | 'pro' | 'advanced' | 'ultra';
  billingCycle: 'monthly' | 'annual';
  credits: number;
  autoRecharge: boolean;
  autoRechargeThreshold: number;
  autoRechargePack: number;
  lastWeeklyBonusClaimedAt?: string;
  createdAt: string;
}

export interface VisionStoryDB {
  user: UserAccount;
  customAvatars: StockAvatar[];
  clonedVoices: VoiceOption[];
  projects: ProjectRecord[];
  ledger: CreditTransaction[];
  apiKeys: ApiKeyRecord[];
  providerKeys: ProviderKeysConfig;
}

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'visionstory-data')
  : path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'visionstory-db.json');

let memoryFallbackDB: VisionStoryDB | null = null;

function createInitialDB(): VisionStoryDB {
  const now = new Date().toISOString();
  const demoKeyRaw = 'vs_live_demo9f84a2c71e6b30d54c8a1f2e';
  const demoHash = crypto.createHash('sha256').update(demoKeyRaw).digest('hex');

  return {
    user: {
      id: 'usr_creator_01',
      name: 'Creator Studio',
      email: 'creator@visionstory.local',
      provider: 'demo',
      plan: 'free',
      billingCycle: 'monthly',
      credits: 10,
      autoRecharge: false,
      autoRechargeThreshold: 10,
      autoRechargePack: 100,
      createdAt: now,
    },
    customAvatars: [],
    clonedVoices: [],
    projects: [
      {
        id: 'vs_demo_01',
        title: 'Bring Characters To Life With Authentic Voice, Facial Movement & Emotion',
        workflow: 'ai-video',
        mode: 'presenter',
        modelId: 'vs_character_v4',
        avatarId: 'av_aria_v4',
        avatarImage: '/assets/avatars/aria.jpg',
        voiceId: 'voice_alloy',
        script:
          'Welcome to VisionStory! Upload a single photo, write your script in any of 88 languages, and V-Character 4.0 brings your presenter to life with natural expressions and crisp lip-sync.',
        motionPrompt: 'Warm eye contact, subtle natural hand gestures while explaining key points',
        resolution: '720p',
        aspectRatio: '9:16',
        greenScreen: false,
        speed: 'normal',
        durationSec: 8,
        creditsUsed: 2,
        status: 'created',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'vs_demo_02',
        title: 'AI Generated Multi-Shot Product Launch With Customizable Emotions',
        workflow: 'ai-agent',
        mode: 'cinematic',
        modelId: 'vs_character_v4',
        avatarId: 'av_marcus_v4',
        avatarImage: '/assets/avatars/marcus.jpg',
        voiceId: 'voice_echo',
        script:
          'Stop stitching together five separate point tools. VisionStory AI Agent plans your script, multi-shot scenes, voiceover, and captions from a single prompt.',
        motionPrompt: 'Confident keynote delivery in modern studio lighting',
        resolution: '1080p',
        aspectRatio: '16:9',
        greenScreen: false,
        speed: 'normal',
        durationSec: 12,
        creditsUsed: 5,
        status: 'created',
        createdAt: now,
        updatedAt: now,
        shots: [
          {
            id: 'shot_1',
            shotNumber: 1,
            title: 'Hook · Studio Opening',
            script: 'Stop stitching together five separate AI tools just to ship one marketing video.',
            visualPrompt: 'Medium close-up of presenter in sleek modern studio',
            cameraMotion: 'Slow Dolly In',
            durationSec: 4,
          },
          {
            id: 'shot_2',
            shotNumber: 2,
            title: 'Workflow · Automated Storyboard',
            script: 'Drop a prompt, URL, or slide deck and VisionStory plans every scene automatically.',
            visualPrompt: 'Dynamic angle with lower-third product callout',
            cameraMotion: 'Subtle Pan Right',
            durationSec: 4,
          },
          {
            id: 'shot_3',
            shotNumber: 3,
            title: 'Call to Action · Publish Ready',
            script: 'Revise any shot by chatting and export in 16:9, 9:16, or 1:1 up to 2K.',
            visualPrompt: 'Crisp centered presenter framing with CTA caption',
            cameraMotion: 'Locked Studio Tripod',
            durationSec: 4,
          },
        ],
      },
    ],
    ledger: [
      {
        id: 'tx_init_1',
        createdAt: now,
        type: 'signup_bonus',
        amount: 10,
        description: 'Eligible new account sign-up credits (V-Character 4.0 ready)',
        balanceAfter: 10,
      },
    ],
    apiKeys: [
      {
        id: 'key_default_01',
        name: 'Default Development Key',
        prefix: 'vs_live_demo',
        keyHash: demoHash,
        rawPreview: demoKeyRaw,
        createdAt: now,
      },
    ],
    providerKeys: {},
  };
}

export function readDB(): VisionStoryDB {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      const initial = memoryFallbackDB || createInitialDB();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      memoryFallbackDB = initial;
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as VisionStoryDB;
    memoryFallbackDB = parsed;
    return parsed;
  } catch {
    if (!memoryFallbackDB) {
      memoryFallbackDB = createInitialDB();
    }
    return memoryFallbackDB;
  }
}

export function writeDB(db: VisionStoryDB): VisionStoryDB {
  memoryFallbackDB = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch {
    // Graceful in-memory persistence if serverless FS is restricted
  }
  return db;
}

export function getAllAvatars(db: VisionStoryDB): StockAvatar[] {
  return [...db.customAvatars, ...STOCK_AVATARS];
}

export function getAllVoices(db: VisionStoryDB): VoiceOption[] {
  return [...db.clonedVoices, ...VOICE_CATALOG];
}

export function createApiKey(name: string): { record: ApiKeyRecord; rawKey: string } {
  const randomHex = crypto.randomBytes(16).toString('hex');
  const rawKey = `vs_live_${randomHex}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const record: ApiKeyRecord = {
    id: `key_${crypto.randomBytes(4).toString('hex')}`,
    name: name.trim() || 'Server Integration Key',
    prefix: rawKey.slice(0, 14),
    keyHash,
    rawPreview: `${rawKey.slice(0, 14)}…${rawKey.slice(-4)}`,
    createdAt: new Date().toISOString(),
  };
  return { record, rawKey };
}

export function verifyApiKey(db: VisionStoryDB, providedKey: string | null): boolean {
  if (!providedKey) return false;
  const trimmed = providedKey.trim();
  const hash = crypto.createHash('sha256').update(trimmed).digest('hex');
  return db.apiKeys.some((k) => k.keyHash === hash || k.rawPreview === trimmed);
}
