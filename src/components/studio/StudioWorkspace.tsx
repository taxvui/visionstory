'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  Clock,
  Download,
  Folder,
  Globe,
  Headphones,
  Info,
  KeyRound,
  LayoutGrid,
  List,
  Music,
  Play,
  Plus,
  Sliders,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  Wand2,
  X,
} from 'lucide-react';
import {
  AI_MODELS,
  CREATOR_TOOLS,
  PODCAST_STUDIOS,
  PRICING_PLANS,
  PricingPlan,
  STOCK_AVATARS,
} from '@/lib/catalog';
import {
  AspectRatioOption,
  ResolutionOption,
  StudioWorkflowType,
  calculateCredits,
} from '@/lib/credits';
import { StoryboardShot } from '@/lib/db';
import { speakScript, stopSpeaking } from '@/lib/audioEngine';
import { renderStudioVideo } from '@/lib/videoRenderer';
import { useVisionStory } from '@/components/VisionStoryProvider';
import { StudioToolsPanel } from './StudioToolsPanel';
import {
  SidebarCollapseIcon,
  VisionStoryPrismLogo,
  VsIconAiAgent,
  VsIconAiVideo,
  VsIconApi,
  VsIconBilling,
  VsIconFaceSwap,
  VsIconLibrary,
  VsIconPodcast,
  VsIconPresentation,
  VsIconPricing,
  VsIconSeedance,
  VsIconTools,
  VsIconViralMusic,
} from '@/components/Icons';

type SidebarTabId =
  | 'ai-video'
  | 'ai-agent'
  | 'viral-music'
  | 'face-swap'
  | 'seedance'
  | 'podcast'
  | 'presentation'
  | 'ai-tools'
  | 'library'
  | 'pricing'
  | 'billing'
  | 'api';

const EXAMPLE_VIDEOS = [
  {
    id: 'ex_1',
    title: 'Quarterly SaaS Product Launch Keynote',
    avatar: '/assets/avatars/aria.jpg',
    duration: '00:42',
    resolution: '1080p',
    script:
      'Welcome to our Q4 release! Today we are unveiling autonomous AI video workflows that turn a single brief into localized multi-shot campaigns.',
  },
  {
    id: 'ex_2',
    title: 'TikTok Creator UGC Skincare Hook',
    avatar: '/assets/avatars/hannah.jpg',
    duration: '00:24',
    resolution: '1080p',
    script:
      'Stop scrolling if your team still spends three days editing short-form social ads! Watch how we spin up ten creator variations in two minutes.',
  },
  {
    id: 'ex_3',
    title: 'Global L&D Employee Onboarding Module',
    avatar: '/assets/avatars/david.jpg',
    duration: '01:15',
    resolution: '2K',
    script:
      'Hello team! In this three-minute onboarding walkthrough, we will cover security best practices and customer communication standards.',
  },
  {
    id: 'ex_4',
    title: 'Barnaby Gold: Tech News Pet Skit',
    avatar: '/assets/avatars/golden-podcaster.jpg',
    duration: '00:19',
    resolution: '720p',
    script:
      'Breaking news from the dog park studio: treats are officially up forty percent this quarter, and squirrels remain at large!',
  },
];

export function StudioWorkspace() {
  const searchParams = useSearchParams();
  const {
    locale,
    setLocale,
    user,
    avatars,
    voices,
    projects,
    ledger,
    apiKeys,
    setAuthModalOpen,
    setSettingsModalOpen,
    setLedgerModalOpen,
    refreshState,
    showToast,
  } = useVisionStory();

  const [activeTab, setActiveTab] = useState<SidebarTabId>(
    () => (searchParams.get('tab') as SidebarTabId) || 'ai-video'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Active Rendered Video Player Modal / Stage
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    videoUrl: string;
    resolution: string;
    durationSec: number;
  } | null>(null);
  const [videoBlobMap, setVideoBlobMap] = useState<Record<string, string>>({});
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  // =========================================================
  // 1. AI VIDEO STATES (Exact u01_ai_video.png)
  // =========================================================
  const [videoMode, setVideoMode] = useState<'presenter' | 'cinematic'>('presenter');
  const [inputModeTab, setInputModeTab] = useState<'script' | 'audio' | 'music'>('script');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(STOCK_AVATARS[0].id);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(voices[0]?.id || 'voice_alloy');
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const [scriptText, setScriptText] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [voiceEnhance, setVoiceEnhance] = useState(true);
  const [motionPreset, setMotionPreset] = useState<'Natural' | 'Expressive' | 'Calm'>('Natural');
  const [avatarModel, setAvatarModel] = useState<'V-Character 4.0' | 'V-Character 5.0 Pro'>('V-Character 4.0');
  const [greenScreen, setGreenScreen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('9:16');
  const [resolution, setResolution] = useState<ResolutionOption>('720p');
  const [bgMusicStyle, setBgMusicStyle] = useState<'ambient' | 'synthwave' | 'acoustic'>('ambient');
  const [isPreviewingAudio, setIsPreviewingAudio] = useState(false);
  const avatarUploadRef = useRef<HTMLInputElement | null>(null);
  const audioUploadRef = useRef<HTMLInputElement | null>(null);
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null);

  // =========================================================
  // 2. AI AGENT STATES (Exact u02_ai_agent.png)
  // =========================================================
  const [agentPrompt, setAgentPrompt] = useState('');
  const [agentShots, setAgentShots] = useState<StoryboardShot[]>([]);
  const [agentTitle, setAgentTitle] = useState('');
  const [agentChatEdit, setAgentChatEdit] = useState('');
  const [isPlanningAgent, setIsPlanningAgent] = useState(false);
  const [creationsFilter, setCreationsFilter] = useState<'all' | 'draft' | 'video'>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // =========================================================
  // 3. VIRAL MUSIC STATES (Exact u03_viral_music.png)
  // =========================================================
  const [musicPerfMode, setMusicPerfMode] = useState<'solo' | 'duet'>('solo');
  const [musicUrlInput, setMusicUrlInput] = useState('');
  const [musicFileName, setMusicFileName] = useState<string | null>(null);
  const [duetAvatarId, setDuetAvatarId] = useState<string>(STOCK_AVATARS[3].id);
  const musicUploadRef = useRef<HTMLInputElement | null>(null);

  // =========================================================
  // 4. FACE SWAP STATES (Exact u04_face_swap.png)
  // =========================================================
  const [swapMediaType, setSwapMediaType] = useState<'video' | 'image'>('video');
  const [swapControlMode, setSwapControlMode] = useState<'Face only' | 'Full body' | 'Motion control'>('Face only');
  const [swapRes, setSwapRes] = useState<ResolutionOption>('720p');
  const [swapTemplateIdx, setSwapTemplateIdx] = useState(0);
  const swapUploadRef = useRef<HTMLInputElement | null>(null);

  // =========================================================
  // 5. SEEDANCE 2.5 STATES (Exact u05_seedance.png)
  // =========================================================
  const [seedanceSubMode, setSeedanceSubMode] = useState<'generate' | 'reference' | 'frames'>('generate');
  const [seedancePrompt, setSeedancePrompt] = useState('');
  const [seedanceModelId, setSeedanceModelId] = useState('v-character-5-pro');
  const [seedanceDuration, setSeedanceDuration] = useState<number>(10);

  // =========================================================
  // 6. VIDEO PODCAST STATES (Exact u06_podcast.png)
  // =========================================================
  const [podcastPrompt, setPodcastPrompt] = useState('');
  const [selectedStudioId, setSelectedStudioId] = useState(PODCAST_STUDIOS[0].id);
  const [podcastCategory, setPodcastCategory] = useState<string>('All');
  const [podcastDurationLabel, setPodcastDurationLabel] = useState('3 minutes');
  const [podcastAutoTranslate, setPodcastAutoTranslate] = useState(true);

  // =========================================================
  // 7. AI PRESENTATION STATES (Exact u07_presentation.png)
  // =========================================================
  const [pptDurationLabel, setPptDurationLabel] = useState('3 minutes');
  const [pptAiScript, setPptAiScript] = useState(true);
  const [uploadedSlideName, setUploadedSlideName] = useState<string | null>(null);
  const [slideOutline, setSlideOutline] = useState<string[]>([
    'Slide 1: VisionStory Q4 Product Overview & Key Milestones',
    'Slide 2: V-Character 4.0 Single-Photo Lifelike Talking Avatars',
    'Slide 3: Global Localization Across 88 Languages & OpenAPI Scale',
  ]);
  const pptUploadRef = useRef<HTMLInputElement | null>(null);

  // =========================================================
  // 8. AI TOOLS, PRICING, BILLING, API STATES
  // =========================================================
  const [toolsCategoryTab, setToolsCategoryTab] = useState<'all' | 'video' | 'image' | 'audio'>('all');
  const [activeInlineSubTool, setActiveInlineSubTool] = useState<string | null>(null);
  const [studioPricingCycle, setStudioPricingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [billingSubTab, setBillingSubTab] = useState<'history' | 'usage'>('history');
  const [newApiKeyName, setNewApiKeyName] = useState('Studio Production Key');
  const [freshRawApiKey, setFreshRawApiKey] = useState<string | null>(null);

  const qTabParam = searchParams.get('tab') as SidebarTabId | null;
  const qToolParam = searchParams.get('tool');
  const qAvatarParam = searchParams.get('avatar');
  const qPromptParam = searchParams.get('prompt');
  const qModelParam = searchParams.get('model');

  // Sync URL query params (?tab=..., ?tool=..., ?avatar=..., ?prompt=..., ?model=...)
  useEffect(() => {
    const params =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const resolvedTab = (qTabParam || params?.get('tab')) as SidebarTabId | null;
    const resolvedTool = qToolParam || params?.get('tool');
    const resolvedAvatar = qAvatarParam || params?.get('avatar');
    const resolvedPrompt = qPromptParam || params?.get('prompt');
    const resolvedModel = qModelParam || params?.get('model');

    if (resolvedTab) setActiveTab(resolvedTab);
    if (resolvedTool) {
      setActiveTab('ai-tools');
      setActiveInlineSubTool(resolvedTool);
    }
    if (resolvedAvatar) setSelectedAvatarId(resolvedAvatar);
    if (resolvedPrompt) setAgentPrompt(resolvedPrompt);
    if (resolvedModel) setSeedanceModelId(resolvedModel);
  }, [qTabParam, qToolParam, qAvatarParam, qPromptParam, qModelParam]);

  const selectedAvatar = useMemo(
    () => avatars.find((a) => a.id === selectedAvatarId) || avatars[0] || STOCK_AVATARS[0],
    [avatars, selectedAvatarId]
  );

  const selectedVoice = useMemo(
    () => voices.find((v) => v.id === selectedVoiceId) || voices[0],
    [voices, selectedVoiceId]
  );

  const selectedPodcastStudio = useMemo(
    () => PODCAST_STUDIOS.find((s) => s.id === selectedStudioId) || PODCAST_STUDIOS[0],
    [selectedStudioId]
  );

  const estimatedSec = useMemo(() => {
    const words = (scriptText.trim() || 'Welcome to VisionStory Studio').split(/\s+/).length;
    return Math.max(6, Math.min(24, Math.ceil(words / 2.3)));
  }, [scriptText]);

  const creditQuote = useMemo(
    () =>
      calculateCredits({
        durationSec: estimatedSec,
        resolution,
        greenScreen,
        cinematicMode: videoMode === 'cinematic',
        workflow: 'ai-video',
      }),
    [estimatedSec, resolution, greenScreen, videoMode]
  );

  // Upload Custom Avatar Portrait
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result);
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_custom_avatar',
          name: file.name.replace(/\.[^.]+$/, '').slice(0, 18) || 'Custom Portrait',
          image: dataUrl,
          defaultVoiceId: selectedVoiceId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        await refreshState();
        if (data.avatar?.id) setSelectedAvatarId(data.avatar.id);
        showToast('Uploaded custom avatar portrait!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Preview Audio via Web Speech TTS
  const handlePreviewAudio = () => {
    if (isPreviewingAudio) {
      stopSpeaking();
      setIsPreviewingAudio(false);
      return;
    }
    const sample =
      scriptText.trim() ||
      selectedVoice?.sampleText ||
      'Hello! Type any script and click Generate to create your lifelike VisionStory talking video.';
    setIsPreviewingAudio(true);
    speakScript({
      text: sample,
      voice: selectedVoice,
      speed: voiceSpeed,
      onEnd: () => setIsPreviewingAudio(false),
    });
  };

  // Universal Real Canvas + WebM Video Synthesis Runner
  const executeStudioRender = async (params: {
    workflow: StudioWorkflowType;
    title: string;
    script: string;
    avatarImg: string;
    secondaryImg?: string;
    aspect: AspectRatioOption;
    res: ResolutionOption;
    green?: boolean;
    cinematic?: boolean;
    durationSec: number;
    shots?: StoryboardShot[];
    music?: string;
  }) => {
    if (isRendering) return;
    setIsRendering(true);
    setRenderProgress(5);

    try {
      // Trigger synchronized speech preview during render
      speakScript({
        text: params.script.slice(0, 220),
        voice: selectedVoice,
        speed: voiceSpeed,
      });

      const rendered = await renderStudioVideo({
        workflow: params.workflow,
        title: params.title,
        script: params.script,
        avatarImage: params.avatarImg,
        secondaryAvatarImage: params.secondaryImg,
        aspectRatio: params.aspect,
        resolution: params.res,
        greenScreen: params.green,
        cinematic: params.cinematic,
        durationSec: params.durationSec,
        shots: params.shots,
        musicStyle: params.music || bgMusicStyle,
        watermark: user.plan === 'free',
        onProgress: (pct) => setRenderProgress(pct),
      });

      const quote = calculateCredits({
        durationSec: params.durationSec,
        resolution: params.res,
        greenScreen: params.green,
        cinematicMode: params.cinematic,
        workflow: params.workflow,
      });

      // Persist project + deduct/log credits
      const saveRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: params.title,
          workflow: params.workflow,
          mode: params.cinematic ? 'cinematic' : 'presenter',
          modelId: avatarModel,
          avatarId: selectedAvatar.id,
          secondaryAvatarId: params.secondaryImg ? duetAvatarId : undefined,
          avatarImage: params.avatarImg,
          secondaryAvatarImage: params.secondaryImg,
          voiceId: selectedVoice?.id || 'voice_alloy',
          script: params.script,
          aspectRatio: params.aspect,
          resolution: params.res,
          greenScreen: Boolean(params.green),
          durationSec: rendered.durationSec,
          creditsUsed: quote.totalCredits,
          shots: params.shots,
        }),
      });

      if (saveRes.ok) {
        const saved = await saveRes.json();
        if (saved.project?.id) {
          setVideoBlobMap((prev) => ({ ...prev, [saved.project.id]: rendered.videoUrl }));
        }
      }

      await refreshState();
      setActiveVideoModal({
        title: params.title,
        videoUrl: rendered.videoUrl,
        resolution: params.res,
        durationSec: rendered.durationSec,
      });
      showToast(`Video rendered (${params.res}) & saved to Library!`);
    } catch (err) {
      console.error(err);
      showToast('Render failed — please try again.');
    } finally {
      setIsRendering(false);
      setRenderProgress(0);
    }
  };

  // AI Agent Multi-Shot Planner
  const handleRunAgentPlanner = async (revisionInstruction?: string) => {
    const promptToUse =
      agentPrompt.trim() ||
      'Launch a modern SaaS AI workspace video highlighting speed, lifelike avatars, and global teams';
    setIsPlanningAgent(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          revisionInstruction
            ? {
                mode: 'revise',
                shots: agentShots,
                instruction: revisionInstruction,
                locale,
              }
            : {
                prompt: promptToUse,
                locale,
              }
        ),
      });
      if (res.ok) {
        const data = await res.json();
        setAgentShots(data.shots || []);
        if (data.title) setAgentTitle(data.title);
        if (revisionInstruction) setAgentChatEdit('');
        showToast(revisionInstruction ? 'Updated storyboard shots!' : 'AI Agent planned multi-shot storyboard!');
      }
    } finally {
      setIsPlanningAgent(false);
    }
  };

  const handlePlanUpgrade = async (plan: PricingPlan) => {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'upgrade_plan',
        planId: plan.id,
        billingCycle: studioPricingCycle,
      }),
    });
    if (res.ok) {
      await refreshState();
      showToast(`Subscribed to ${plan.name}! Credits added to balance.`);
    }
  };

  const handleCreateStudioApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_api_key', name: newApiKeyName }),
    });
    if (res.ok) {
      const data = await res.json();
      setFreshRawApiKey(data.rawKey);
      await refreshState();
      showToast('Generated new VisionStory API key!');
    }
  };

  const MAIN_NAV_ITEMS: { id: SidebarTabId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'ai-video', label: 'AI Video', icon: <VsIconAiVideo /> },
    { id: 'ai-agent', label: 'AI Agent', icon: <VsIconAiAgent /> },
    { id: 'viral-music', label: 'Viral Music', icon: <VsIconViralMusic />, badge: 'Duet' },
    { id: 'face-swap', label: 'Face Swap', icon: <VsIconFaceSwap /> },
    { id: 'seedance', label: 'Seedance 2.5', icon: <VsIconSeedance /> },
    { id: 'podcast', label: 'Video Podcast', icon: <VsIconPodcast /> },
    { id: 'presentation', label: 'AI Presentation', icon: <VsIconPresentation /> },
    { id: 'ai-tools', label: 'AI Tools', icon: <VsIconTools /> },
  ];

  const BOTTOM_NAV_ITEMS: { id: SidebarTabId; label: string; icon: React.ReactNode }[] = [
    { id: 'library', label: 'Library', icon: <VsIconLibrary /> },
    { id: 'pricing', label: 'Pricing', icon: <VsIconPricing /> },
    { id: 'billing', label: 'Billing', icon: <VsIconBilling /> },
    { id: 'api', label: 'API', icon: <VsIconApi /> },
  ];

  return (
    <div className="vs-studio-app">
      {/* =========================================================
          DETACHED FLOATING LEFT SIDEBAR (Exact 1:1 u01_ai_video.png)
          ========================================================= */}
      <aside className={`vs-studio-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div>
          {/* Logo Header + Collapse Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              padding: '4px 6px 18px',
            }}
          >
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <VisionStoryPrismLogo size={34} boxed />
              {!sidebarCollapsed && (
                <span style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '-0.02em' }}>
                  VisionStory
                </span>
              )}
            </Link>
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                title="Collapse sidebar"
                style={{ padding: 4 }}
              >
                <SidebarCollapseIcon />
              </button>
            )}
          </div>

          {sidebarCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <button type="button" onClick={() => setSidebarCollapsed(false)} title="Expand sidebar">
                <SidebarCollapseIcon />
              </button>
            </div>
          )}

          {/* Primary 8 Workflows */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {MAIN_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`vs-sidebar-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'ai-tools') setActiveInlineSubTool(null);
                }}
                title={item.label}
              >
                <span style={{ flexShrink: 0, display: 'inline-flex' }}>{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
                    {item.badge && <span className="vs-tag-duet">{item.badge}</span>}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Hairline Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 8px' }} />

          {/* Secondary 4 Workspace Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {BOTTOM_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`vs-sidebar-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
              >
                <span style={{ flexShrink: 0, display: 'inline-flex' }}>{item.icon}</span>
                {!sidebarCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {!sidebarCollapsed && (
          <div style={{ padding: '8px 10px 2px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <button
              type="button"
              onClick={() => setLedgerModalOpen(true)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.82)',
                fontWeight: 600,
              }}
            >
              <span>Credits</span>
              <span style={{ color: '#a59eff' }}>{user.credits} cr</span>
            </button>
          </div>
        )}
      </aside>

      {/* =========================================================
          MAIN CENTERED STUDIO STAGE
          ========================================================= */}
      <div className="vs-studio-main">
        {/* Top-Right Floating Controls matching u01_ai_video.png: [EN/VI] [Keys] [Sign Up] [Log In] */}
        <div className="vs-studio-topbar">
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
            className="vs-btn-ghost"
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
            title="Switch Language"
          >
            <Globe size={14} />
            <span>{locale === 'en' ? 'EN' : 'VI'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSettingsModalOpen(true)}
            className="vs-btn-ghost"
            style={{ padding: '6px 9px' }}
            title="Configure Optional External AI Provider Keys"
          >
            <KeyRound size={15} />
          </button>

          {user.provider === 'demo' ? (
            <>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="vs-btn vs-btn-secondary vs-btn-sm"
                style={{ height: 34, padding: '0 16px', borderRadius: 10 }}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="vs-btn vs-btn-primary vs-btn-sm"
                style={{ height: 34, padding: '0 16px', borderRadius: 10 }}
              >
                Log In
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setLedgerModalOpen(true)}
              className="vs-btn vs-btn-primary vs-btn-sm"
              style={{ height: 34, padding: '0 16px', borderRadius: 10 }}
            >
              {user.name} · {user.credits} cr
            </button>
          )}
        </div>

        {/* Live Rendering Progress Banner */}
        {isRendering && (
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto 18px',
              padding: '12px 18px',
              borderRadius: 14,
              background: 'rgba(98, 93, 245, 0.16)',
              border: '1px solid rgba(98, 93, 245, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.86rem', fontWeight: 600 }}>
              <Sparkles size={16} style={{ color: '#a59eff' }} />
              <span>Synthesizing VisionStory HD WebM Video & Stereo Audio...</span>
            </div>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.86rem' }}>{renderProgress}%</span>
          </div>
        )}

        {/* =========================================================
            TAB 1: AI VIDEO (Exact 1:1 u01_ai_video.png)
            ========================================================= */}
        {activeTab === 'ai-video' && (
          <div>
            <h1 className="vs-studio-title">
              {locale === 'vi' ? 'Nhân vật của bạn sẽ nói gì?' : 'What should your avatar say?'}
            </h1>

            {/* [ Presenter | Cinematic ] */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
              <div className="vs-mode-pill-group">
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${videoMode === 'presenter' ? 'active' : ''}`}
                  onClick={() => setVideoMode('presenter')}
                >
                  <VsIconAiVideo />
                  <span>Presenter</span>
                </button>
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${videoMode === 'cinematic' ? 'active' : ''}`}
                  onClick={() => setVideoMode('cinematic')}
                >
                  <Sparkles size={15} />
                  <span>Cinematic</span>
                </button>
              </div>
            </div>

            {/* 2-Column Main AI Video Card */}
            <div className="vs-aivideo-card">
              {/* LEFT COLUMN: [Upload | Generate] + 4x3 Avatar Grid */}
              <div>
                <input
                  ref={avatarUploadRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarFileUpload}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <button
                    type="button"
                    className="vs-upload-gen-btn"
                    onClick={() => avatarUploadRef.current?.click()}
                  >
                    <Upload size={16} />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    className="vs-upload-gen-btn"
                    onClick={() => {
                      setActiveTab('ai-tools');
                      setActiveInlineSubTool('image-gen');
                    }}
                  >
                    <Wand2 size={16} />
                    <span>Generate</span>
                  </button>
                </div>

                <div className="vs-avatar-grid-4">
                  {avatars.map((av) => {
                    const isSelected = av.id === selectedAvatar.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        className={`vs-avatar-tile ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAvatarId(av.id);
                          if (av.defaultVoiceId) setSelectedVoiceId(av.defaultVoiceId);
                        }}
                      >
                        <img src={av.image} alt={av.name} />
                        <span className="vs-avatar-tile-badge">{av.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Script | Audio | Music + Voice Bar + Textarea + Bottom Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 420 }}>
                <div>
                  {/* Underline Tabs */}
                  <div className="vs-underline-tabs" style={{ marginBottom: 14 }}>
                    {[
                      { id: 'script', label: 'Script' },
                      { id: 'audio', label: 'Audio' },
                      { id: 'music', label: 'Music' },
                    ].map((tItem) => (
                      <button
                        key={tItem.id}
                        type="button"
                        className={`vs-underline-tab ${inputModeTab === tItem.id ? 'active' : ''}`}
                        onClick={() => setInputModeTab(tItem.id as typeof inputModeTab)}
                      >
                        <span>{tItem.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Voice Controls Row: [ Change Voice ] [ Clone ] [ ▶ Preview Audio   Pro ] */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, position: 'relative' }}>
                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      style={{ height: 40, padding: '0 13px', gap: 9 }}
                      onClick={() => setVoiceDropdownOpen((v) => !v)}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(45, 212, 191, 0.18)',
                          color: '#2dd4bf',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                        }}
                      >
                        ılı
                      </span>
                      <span>{selectedVoice ? `${selectedVoice.name}` : 'Change Voice'}</span>
                      <ChevronDown size={13} style={{ opacity: 0.6 }} />
                    </button>

                    {voiceDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 46,
                          left: 0,
                          width: 290,
                          background: '#171923',
                          border: '1px solid rgba(255,255,255,0.14)',
                          borderRadius: 14,
                          padding: 8,
                          zIndex: 40,
                          boxShadow: 'var(--shadow-elevated)',
                        }}
                      >
                        {voices.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setSelectedVoiceId(v.id);
                              setVoiceDropdownOpen(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 9,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: v.id === selectedVoiceId ? 'rgba(98,93,245,0.2)' : 'transparent',
                              fontSize: '0.82rem',
                              textAlign: 'left',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 650 }}>{v.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.language}</div>
                            </div>
                            {v.id === selectedVoiceId && <Check size={14} style={{ color: '#a59eff' }} />}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      style={{ height: 40, padding: '0 13px' }}
                      onClick={() => {
                        setActiveTab('ai-tools');
                        setActiveInlineSubTool('voice-clone');
                      }}
                    >
                      <Volume2 size={14} style={{ color: '#f43f5e' }} />
                      <span>Clone</span>
                    </button>

                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      style={{ height: 40, flex: 1, justifyContent: 'space-between', padding: '0 14px' }}
                      onClick={handlePreviewAudio}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Play size={13} fill="currentColor" />
                        <span>{isPreviewingAudio ? 'Stop Preview' : 'Preview Audio'}</span>
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700 }}>Pro</span>
                    </button>
                  </div>

                  {/* Main Script / Audio / Music Content Area */}
                  {inputModeTab === 'script' && (
                    <textarea
                      className="vs-clean-textarea"
                      rows={7}
                      placeholder="Type whatever you want your character to say..."
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                    />
                  )}

                  {inputModeTab === 'audio' && (
                    <div
                      style={{
                        border: '1px dashed rgba(255,255,255,0.14)',
                        borderRadius: 14,
                        padding: '36px 20px',
                        textAlign: 'center',
                        marginTop: 8,
                      }}
                    >
                      <input
                        ref={audioUploadRef}
                        type="file"
                        accept="audio/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setUploadedAudioName(f.name);
                            showToast(`Loaded voiceover audio: ${f.name}`);
                          }
                        }}
                      />
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 6 }}>
                        {uploadedAudioName || 'Upload MP3, WAV, or M4A voiceover'}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                        V-Character 4.0 lip-syncs directly to your recorded audio track
                      </div>
                      <button
                        type="button"
                        className="vs-btn vs-btn-primary vs-btn-sm"
                        onClick={() => audioUploadRef.current?.click()}
                      >
                        <Upload size={14} /> Upload Audio
                      </button>
                    </div>
                  )}

                  {inputModeTab === 'music' && (
                    <div style={{ paddingTop: 6 }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                        Choose studio backing atmosphere embedded into your video:
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {(['ambient', 'synthwave', 'acoustic'] as const).map((mStyle) => (
                          <button
                            key={mStyle}
                            type="button"
                            onClick={() => setBgMusicStyle(mStyle)}
                            className={`vs-ctrl-pill ${bgMusicStyle === mStyle ? 'active' : ''}`}
                            style={{
                              borderColor: bgMusicStyle === mStyle ? '#625df5' : undefined,
                              textTransform: 'capitalize',
                            }}
                          >
                            <Music size={13} />
                            <span>{mStyle}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Utility & Model Controls matching u01_ai_video.png 1:1 */}
                <div>
                  {/* [ ⏱ ] [ ılı Voice Enhance ] ---------- [ 👋 Motion ] */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="vs-ctrl-pill"
                        onClick={() =>
                          setVoiceSpeed((s) => (s === 'normal' ? 'fast' : s === 'fast' ? 'slow' : 'normal'))
                        }
                        title="Speech Speed"
                      >
                        <Clock size={14} />
                        {voiceSpeed !== 'normal' && <span>{voiceSpeed}</span>}
                      </button>
                      <button
                        type="button"
                        className="vs-ctrl-pill"
                        onClick={() => setVoiceEnhance((v) => !v)}
                        style={voiceEnhance ? { borderColor: 'rgba(98,93,245,0.55)', color: '#fff' } : undefined}
                      >
                        <Sparkles size={13} style={{ color: voiceEnhance ? '#a59eff' : undefined }} />
                        <span>Voice Enhance</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      onClick={() =>
                        setMotionPreset((m) =>
                          m === 'Natural' ? 'Expressive' : m === 'Expressive' ? 'Calm' : 'Natural'
                        )
                      }
                    >
                      <Wand2 size={13} />
                      <span>Motion: {motionPreset}</span>
                    </button>
                  </div>

                  {/* [ V-Character 4.0 ⌄ ] [ Green Screen switch ] [ 9:16 ⌄ ] [ 720p | 1080p | 2K ] */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 8,
                      paddingBottom: 14,
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      marginBottom: 14,
                    }}
                  >
                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      onClick={() =>
                        setAvatarModel((m) =>
                          m === 'V-Character 4.0' ? 'V-Character 5.0 Pro' : 'V-Character 4.0'
                        )
                      }
                    >
                      <span>{avatarModel}</span>
                      <ChevronDown size={13} style={{ opacity: 0.6 }} />
                    </button>

                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      onClick={() => setGreenScreen((g) => !g)}
                      title="Green Screen Chroma Cutout"
                    >
                      <span style={{ fontSize: '0.75rem' }}>BG</span>
                      <span className={`vs-switch ${greenScreen ? 'on' : ''}`}>
                        <span className="vs-switch-thumb" />
                      </span>
                    </button>

                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      onClick={() =>
                        setAspectRatio((ar) => (ar === '9:16' ? '16:9' : ar === '16:9' ? '1:1' : '9:16'))
                      }
                    >
                      <span>{aspectRatio}</span>
                      <ChevronDown size={13} style={{ opacity: 0.6 }} />
                    </button>

                    <div
                      style={{
                        display: 'inline-flex',
                        background: '#161822',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 9,
                        padding: 2,
                        marginLeft: 'auto',
                      }}
                    >
                      {(['720p', '1080p', '2K'] as ResolutionOption[]).map((resOpt) => (
                        <button
                          key={resOpt}
                          type="button"
                          onClick={() => setResolution(resOpt)}
                          style={{
                            padding: '5px 11px',
                            borderRadius: 7,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            background: resolution === resOpt ? '#262938' : 'transparent',
                            color: resolution === resOpt ? '#ffffff' : 'rgba(255,255,255,0.52)',
                          }}
                        >
                          {resOpt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Credits Bills ⓘ  ---------  [ Generate ] */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setLedgerModalOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <span>Credits Bills ({creditQuote.totalCredits} cr)</span>
                      <Info size={13} />
                    </button>

                    <button
                      type="button"
                      disabled={isRendering}
                      onClick={() =>
                        executeStudioRender({
                          workflow: 'ai-video',
                          title: `${selectedAvatar.name} — Talking Video`,
                          script:
                            scriptText.trim() ||
                            selectedVoice?.sampleText ||
                            'Welcome to VisionStory! Turn any photo and script into a lifelike AI talking video.',
                          avatarImg: selectedAvatar.image,
                          aspect: aspectRatio,
                          res: resolution,
                          green: greenScreen,
                          cinematic: videoMode === 'cinematic',
                          durationSec: estimatedSec,
                        })
                      }
                      className="vs-btn vs-btn-primary"
                      style={{ height: 40, padding: '0 22px' }}
                    >
                      {isRendering ? `Rendering ${renderProgress}%` : 'Generate'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Example & User Creations Gallery Below */}
            <div style={{ maxWidth: 1120, margin: '34px auto 0' }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: 14 }}>Example</h3>
              <div className="vs-grid-4">
                {EXAMPLE_VIDEOS.map((ex) => (
                  <div
                    key={ex.id}
                    className="vs-card vs-card-interactive"
                    style={{ overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => {
                      setScriptText(ex.script);
                      showToast(`Loaded example script: "${ex.title}"`);
                    }}
                  >
                    <div style={{ position: 'relative', height: 210 }}>
                      <img src={ex.avatar} alt={ex.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(0,0,0,0.72)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        {ex.duration} · {ex.resolution}
                      </span>
                    </div>
                    <div style={{ padding: '11px 13px' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 650, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ex.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: AI AGENT (Exact 1:1 u02_ai_agent.png)
            ========================================================= */}
        {activeTab === 'ai-agent' && (
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <h1 className="vs-studio-title">Turn your idea into an engaging talking video</h1>

            {/* Centered Agent Composer Card */}
            <div className="vs-composer-card" style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <button
                  type="button"
                  className="vs-ctrl-pill"
                  style={{ height: 38, padding: '0 12px', gap: 9 }}
                  onClick={() => {
                    const idx = avatars.findIndex((a) => a.id === selectedAvatar.id);
                    const next = avatars[(idx + 1) % avatars.length];
                    if (next) setSelectedAvatarId(next.id);
                  }}
                >
                  <img
                    src={selectedAvatar.image}
                    alt={selectedAvatar.name}
                    style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }}
                  />
                  <span>Avatar ({selectedAvatar.name})</span>
                </button>

                <button
                  type="button"
                  className="vs-ctrl-pill"
                  style={{ height: 38, padding: '0 12px', gap: 9 }}
                  onClick={() => {
                    const idx = voices.findIndex((v) => v.id === selectedVoice?.id);
                    const next = voices[(idx + 1) % voices.length];
                    if (next) setSelectedVoiceId(next.id);
                  }}
                >
                  <Volume2 size={15} style={{ color: '#38bdf8' }} />
                  <span>Auto Voice ({selectedVoice?.name})</span>
                </button>
              </div>

              <textarea
                className="vs-clean-textarea"
                rows={4}
                placeholder="Describe your scene, message, or story..."
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="vs-ctrl-pill"
                    style={{ width: 34, padding: 0, justifyContent: 'center' }}
                    onClick={() =>
                      setAgentPrompt(
                        'Create a 3-shot SaaS launch video introducing V-Character 4.0 lifelike avatars, global localization in 88 languages, and instant API automation.'
                      )
                    }
                    title="Insert Sample Brief"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    type="button"
                    className="vs-ctrl-pill"
                    onClick={() =>
                      setAspectRatio((ar) => (ar === '16:9' ? '9:16' : ar === '9:16' ? '1:1' : '16:9'))
                    }
                  >
                    <span>{aspectRatio}</span>
                    <ChevronDown size={13} style={{ opacity: 0.6 }} />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isPlanningAgent}
                  className="vs-circle-submit"
                  onClick={() => handleRunAgentPlanner()}
                  title="Plan Multi-Shot Video"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>

            {/* Interactive Storyboard Output when AI Agent has planned shots */}
            {agentShots.length > 0 && (
              <div className="vs-card" style={{ padding: 22, marginBottom: 28, borderColor: 'rgba(98,93,245,0.45)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <span className="vs-tag vs-tag-brand" style={{ marginBottom: 4 }}>AI Agent Multi-Shot Plan</span>
                    <h3 className="vs-h3">{agentTitle}</h3>
                  </div>
                  <button
                    type="button"
                    disabled={isRendering}
                    className="vs-btn vs-btn-primary vs-btn-sm"
                    onClick={() =>
                      executeStudioRender({
                        workflow: 'ai-agent',
                        title: agentTitle || 'AI Agent Video',
                        script: agentShots.map((s) => s.script).join(' '),
                        avatarImg: selectedAvatar.image,
                        aspect: aspectRatio,
                        res: '1080p',
                        durationSec: agentShots.reduce((acc, s) => acc + s.durationSec, 0),
                        shots: agentShots,
                      })
                    }
                  >
                    <Play size={14} /> Render Full Multi-Shot Video
                  </button>
                </div>

                <div className="vs-grid-3" style={{ marginBottom: 14 }}>
                  {agentShots.map((shot, idx) => (
                    <div key={shot.id} style={{ background: '#161822', borderRadius: 12, padding: 14, border: '1px solid var(--border-hairline)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a59eff', fontWeight: 700, marginBottom: 6 }}>
                        <span>SHOT {idx + 1} · {shot.cameraMotion}</span>
                        <span>{shot.durationSec}s</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', marginBottom: 6 }}>{shot.title}</div>
                      <textarea
                        className="vs-textarea"
                        rows={3}
                        style={{ fontSize: '0.78rem' }}
                        value={shot.script}
                        onChange={(e) => {
                          const updated = [...agentShots];
                          updated[idx] = { ...shot, script: e.target.value };
                          setAgentShots(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="vs-input"
                    placeholder="Chat to refine any shot (e.g., 'Make Shot 1 punchier for TikTok')..."
                    value={agentChatEdit}
                    onChange={(e) => setAgentChatEdit(e.target.value)}
                  />
                  <button
                    type="button"
                    className="vs-btn vs-btn-secondary vs-btn-sm"
                    onClick={() => handleRunAgentPlanner(agentChatEdit || 'Make narration more energetic')}
                  >
                    Refine Shots
                  </button>
                </div>
              </div>
            )}

            {/* 4 Quick Workflow Shortcut Cards matching u02_ai_agent.png */}
            <div className="vs-grid-4" style={{ marginBottom: 34 }}>
              {[
                { id: 'viral-music', title: 'Viral Music', img: '/assets/showcase/music-singer.jpg', icon: <VsIconViralMusic /> },
                { id: 'face-swap', title: 'Face Swap', img: '/assets/avatars/claire.jpg', icon: <VsIconFaceSwap /> },
                { id: 'podcast', title: 'Video Podcast', img: '/assets/showcase/podcast-mindful.jpg', icon: <VsIconPodcast /> },
                { id: 'presentation', title: 'AI Presentation', img: '/assets/avatars/elena.jpg', icon: <VsIconPresentation /> },
              ].map((wf) => (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => setActiveTab(wf.id as SidebarTabId)}
                  className="vs-card vs-card-interactive"
                  style={{
                    height: 132,
                    position: 'relative',
                    overflow: 'hidden',
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                  }}
                >
                  <img
                    src={wf.img}
                    alt={wf.title}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      width: '62%',
                      height: '100%',
                      objectFit: 'cover',
                      maskImage: 'linear-gradient(90deg, transparent 0%, #000 55%)',
                      WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 55%)',
                      opacity: 0.72,
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.1)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {wf.icon}
                  </span>
                  <span style={{ position: 'relative', fontWeight: 700, fontSize: '0.92rem' }}>{wf.title}</span>
                </button>
              ))}
            </div>

            {/* Recent Creations Header + All | Draft | Video */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Recent Creations</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['all', 'draft', 'video'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setCreationsFilter(f)}
                      style={{
                        padding: '5px 13px',
                        borderRadius: 8,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: creationsFilter === f ? '#232533' : 'transparent',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: creationsFilter === f ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, background: '#14151e', padding: 3, borderRadius: 8, border: '1px solid var(--border-hairline)' }}>
                <button type="button" onClick={() => setViewLayout('grid')} style={{ padding: 5, opacity: viewLayout === 'grid' ? 1 : 0.45 }}>
                  <LayoutGrid size={14} />
                </button>
                <button type="button" onClick={() => setViewLayout('list')} style={{ padding: 5, opacity: viewLayout === 'list' ? 1 : 0.45 }}>
                  <List size={14} />
                </button>
              </div>
            </div>

            <div className={viewLayout === 'grid' ? 'vs-grid-3' : ''} style={viewLayout === 'list' ? { display: 'flex', flexDirection: 'column', gap: 10 } : undefined}>
              {(projects.length > 0
                ? projects.map((p) => ({
                    id: p.id,
                    title: p.title,
                    avatarImage: p.avatarImage,
                    resolution: p.resolution,
                    durationSec: p.durationSec,
                    videoUrl: videoBlobMap[p.id] || p.videoDataUrl || '',
                  }))
                : EXAMPLE_VIDEOS.slice(0, 2).map((e) => ({
                    id: e.id,
                    title: e.title,
                    avatarImage: e.avatar,
                    resolution: e.resolution as ResolutionOption,
                    durationSec: 28,
                    videoUrl: '',
                  }))
              ).map((proj) => (
                <div
                  key={proj.id}
                  className="vs-card vs-card-interactive"
                  style={{ overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => {
                    if (proj.videoUrl) {
                      setActiveVideoModal({
                        title: proj.title,
                        videoUrl: proj.videoUrl,
                        resolution: proj.resolution,
                        durationSec: proj.durationSec,
                      });
                    } else {
                      setAgentPrompt(proj.title);
                      handleRunAgentPlanner();
                    }
                  }}
                >
                  <div style={{ position: 'relative', height: 185 }}>
                    <img src={proj.avatarImage} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        padding: '2px 9px',
                        borderRadius: 999,
                        background: '#eab308',
                        color: '#000',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}
                    >
                      New
                    </span>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 650, fontSize: '0.86rem' }}>{proj.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: VIRAL MUSIC (Exact 1:1 u03_viral_music.png)
            ========================================================= */}
        {activeTab === 'viral-music' && (
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <h1 className="vs-studio-title">
              Turn your song into a {musicPerfMode === 'duet' ? 'duet' : 'solo'} performance
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
              <div className="vs-mode-pill-group">
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${musicPerfMode === 'solo' ? 'active' : ''}`}
                  onClick={() => setMusicPerfMode('solo')}
                >
                  <span>Solo</span>
                </button>
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${musicPerfMode === 'duet' ? 'active' : ''}`}
                  onClick={() => setMusicPerfMode('duet')}
                >
                  <span>Duet</span>
                </button>
              </div>
            </div>

            {/* Warm Tinted Upload / Link Card */}
            <div
              className="vs-composer-card"
              style={{
                maxWidth: 740,
                background: 'linear-gradient(145deg, rgba(65, 42, 46, 0.52) 0%, rgba(22, 23, 34, 0.92) 65%)',
                padding: '34px 28px 22px',
                marginBottom: 36,
              }}
            >
              <input
                ref={musicUploadRef}
                type="file"
                accept="audio/*,video/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setMusicFileName(f.name);
                    showToast(`Loaded track: ${f.name}`);
                  }
                }}
              />

              <div style={{ textAlign: 'center', marginBottom: 26 }}>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.68)', marginBottom: 16 }}>
                  {musicFileName
                    ? `Selected Track: ${musicFileName}`
                    : 'Supported formats: MP3, MP4, MOV, WEBM, M4A'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                  <button
                    type="button"
                    className="vs-btn vs-btn-primary vs-btn-sm"
                    style={{ height: 38, padding: '0 20px' }}
                    onClick={() => musicUploadRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>Upload</span>
                  </button>

                  <button
                    type="button"
                    className="vs-btn vs-btn-secondary vs-btn-sm"
                    style={{ height: 38, padding: '0 20px' }}
                    onClick={() =>
                      executeStudioRender({
                        workflow: 'viral-music',
                        title: `${selectedAvatar.name} ${musicPerfMode === 'duet' ? '& Co-Star ' : ''}— Viral Music Video`,
                        script:
                          'Chasing neon city lights tonight, singing every beat in crystal harmony across the midnight skyline!',
                        avatarImg: selectedAvatar.image,
                        secondaryImg:
                          musicPerfMode === 'duet'
                            ? avatars.find((a) => a.id === duetAvatarId)?.image
                            : undefined,
                        aspect: '16:9',
                        res: '1080p',
                        durationSec: 10,
                        music: 'synthwave',
                      })
                    }
                  >
                    <Folder size={14} />
                    <span>Assets (Demo Song)</span>
                  </button>
                </div>

                {musicPerfMode === 'duet' && (
                  <div style={{ fontSize: '0.78rem', color: '#fbbf24' }}>
                    Duet Performers: <strong>{selectedAvatar.name}</strong> +{' '}
                    <button
                      type="button"
                      style={{ textDecoration: 'underline', color: '#fff' }}
                      onClick={() => {
                        const idx = avatars.findIndex((a) => a.id === duetAvatarId);
                        const next = avatars[(idx + 1) % avatars.length];
                        if (next) setDuetAvatarId(next.id);
                      }}
                    >
                      {avatars.find((a) => a.id === duetAvatarId)?.name || 'Marcus'} (Change)
                    </button>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, display: 'flex', gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'rgba(0,0,0,0.34)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 999,
                    padding: '0 16px',
                    height: 42,
                  }}
                >
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
                  <span style={{ width: 18, height: 13, borderRadius: 4, background: '#ef4444', display: 'inline-block' }} />
                  <input
                    type="text"
                    value={musicUrlInput}
                    onChange={(e) => setMusicUrlInput(e.target.value)}
                    placeholder="Paste a link to extract the music file (Suno, Udio, YouTube)"
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.84rem',
                      color: '#fff',
                    }}
                  />
                </div>
                {musicUrlInput.trim() && (
                  <button
                    type="button"
                    className="vs-btn vs-btn-primary vs-btn-sm"
                    onClick={() =>
                      executeStudioRender({
                        workflow: 'viral-music',
                        title: `Extracted Song MV — ${selectedAvatar.name}`,
                        script: 'Singing extracted track with frame-accurate vocal lip sync!',
                        avatarImg: selectedAvatar.image,
                        aspect: '9:16',
                        res: '1080p',
                        durationSec: 10,
                        music: 'synthwave',
                      })
                    }
                  >
                    Generate MV
                  </button>
                )}
              </div>
            </div>

            {/* Videos + Explore Grid */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 700, fontSize: '1.08rem' }}>Videos</span>
                <span className="vs-tag">View drafts</span>
              </div>
              <button type="button" className="vs-tag" onClick={() => setActiveTab('library')}>
                See All
              </button>
            </div>

            {projects.filter((p) => p.workflow === 'viral-music').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '26px 0 38px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No music videos yet — click Assets (Demo Song) or paste a link above to render one!
              </div>
            ) : (
              <div className="vs-grid-4" style={{ marginBottom: 32 }}>
                {projects
                  .filter((p) => p.workflow === 'viral-music')
                  .map((mv) => {
                    const mvUrl = videoBlobMap[mv.id] || mv.videoDataUrl;
                    return (
                      <div
                        key={mv.id}
                        className="vs-card vs-card-interactive"
                        style={{ overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() =>
                          mvUrl &&
                          setActiveVideoModal({
                            title: mv.title,
                            videoUrl: mvUrl,
                            resolution: mv.resolution,
                            durationSec: mv.durationSec,
                          })
                        }
                      >
                        <img src={mv.avatarImage} alt={mv.title} style={{ width: '100%', height: 175, objectFit: 'cover' }} />
                        <div style={{ padding: 10, fontSize: '0.82rem', fontWeight: 650 }}>{mv.title}</div>
                      </div>
                    );
                  })}
              </div>
            )}

            <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 14 }}>Explore</div>
            <div className="vs-grid-4">
              {[
                { title: 'Acoustic Courtyard Ballad', img: '/assets/avatars/marcus.jpg' },
                { title: 'Midnight Neon Synth Pop', img: '/assets/showcase/music-singer.jpg' },
                { title: ' Highland Castle Anthem', img: '/assets/showcase/seedance-cinema.jpg' },
                { title: 'Studio Booth R&B Session', img: '/assets/avatars/elena.jpg' },
              ].map((card) => (
                <div
                  key={card.title}
                  className="vs-card vs-card-interactive"
                  style={{ overflow: 'hidden', position: 'relative', height: 220, cursor: 'pointer' }}
                  onClick={() =>
                    executeStudioRender({
                      workflow: 'viral-music',
                      title: card.title,
                      script: `${card.title} — VisionStory AI Singing Performance`,
                      avatarImg: card.img,
                      aspect: '9:16',
                      res: '1080p',
                      durationSec: 8,
                      music: 'synthwave',
                    })
                  }
                >
                  <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Play size={12} fill="white" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: FACE SWAP (Exact 1:1 u04_face_swap.png)
            ========================================================= */}
        {activeTab === 'face-swap' && (
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <h1 className="vs-studio-title">
              Instant face replacement for {swapMediaType === 'video' ? 'video clips' : 'photos'}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
              <div className="vs-mode-pill-group">
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${swapMediaType === 'video' ? 'active' : ''}`}
                  onClick={() => setSwapMediaType('video')}
                >
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${swapMediaType === 'image' ? 'active' : ''}`}
                  onClick={() => setSwapMediaType('image')}
                >
                  <span>Image</span>
                </button>
              </div>
            </div>

            <div className="vs-card" style={{ padding: 22, borderRadius: 22 }}>
              <input
                ref={swapUploadRef}
                type="file"
                accept={swapMediaType === 'video' ? 'video/*,image/*' : 'image/*'}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) showToast(`Selected target media: ${f.name}`);
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 18, marginBottom: 18 }}>
                {/* Left Upload Slot */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '28px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <img
                      src={selectedAvatar.image}
                      alt="Face source"
                      style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', border: '2px solid #fff', transform: 'rotate(-6deg)' }}
                    />
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>→</span>
                    <img
                      src={['/assets/avatars/hannah.jpg', '/assets/avatars/linh.jpg', '/assets/avatars/nina.jpg'][swapTemplateIdx]}
                      alt="Target clip"
                      style={{ width: 126, height: 92, borderRadius: 12, objectFit: 'cover', border: '2px solid #fff' }}
                    />
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.96rem', marginBottom: 4 }}>
                    Upload your {swapMediaType}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Supported formats: MP4, MOV, WEBM
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      className="vs-btn vs-btn-primary vs-btn-sm"
                      onClick={() => swapUploadRef.current?.click()}
                    >
                      <Upload size={14} /> Upload
                    </button>
                    <button
                      type="button"
                      className="vs-btn vs-btn-secondary vs-btn-sm"
                      onClick={() => {
                        const idx = avatars.findIndex((a) => a.id === selectedAvatar.id);
                        const next = avatars[(idx + 1) % avatars.length];
                        if (next) setSelectedAvatarId(next.id);
                      }}
                    >
                      <Folder size={14} /> Face: {selectedAvatar.name}
                    </button>
                  </div>
                </div>

                {/* Right Trending Templates Panel */}
                <div style={{ background: '#171923', borderRadius: 16, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', textAlign: 'center', marginBottom: 12 }}>
                    Trending Templates
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {['/assets/avatars/hannah.jpg', '/assets/avatars/linh.jpg', '/assets/avatars/nina.jpg'].map(
                      (tplImg, idx) => (
                        <button
                          key={tplImg}
                          type="button"
                          onClick={() => setSwapTemplateIdx(idx)}
                          style={{
                            height: 190,
                            borderRadius: 10,
                            overflow: 'hidden',
                            border: swapTemplateIdx === idx ? '2px solid #625df5' : '2px solid transparent',
                          }}
                        >
                          <img src={tplImg} alt={`Template ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Controls Row */}
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  paddingTop: 14,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'inline-flex', background: '#161822', padding: 3, borderRadius: 9, border: '1px solid var(--border-hairline)' }}>
                    {(['Face only', 'Full body', 'Motion control'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSwapControlMode(m)}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          background: swapControlMode === m ? '#262938' : 'transparent',
                          color: swapControlMode === m ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'inline-flex', background: '#161822', padding: 3, borderRadius: 9, border: '1px solid var(--border-hairline)' }}>
                    {(['720p', '1080p'] as ResolutionOption[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSwapRes(r)}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          background: swapRes === r ? '#262938' : 'transparent',
                          color: swapRes === r ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isRendering}
                  className="vs-btn vs-btn-primary vs-btn-sm"
                  style={{ height: 38, padding: '0 22px' }}
                  onClick={() =>
                    executeStudioRender({
                      workflow: 'face-swap',
                      title: `Face Swap (${swapControlMode}) — ${selectedAvatar.name}`,
                      script: `Realistic HD Face Swap tracking ${selectedAvatar.name} across motion and lighting.`,
                      avatarImg: selectedAvatar.image,
                      secondaryImg: ['/assets/avatars/hannah.jpg', '/assets/avatars/linh.jpg', '/assets/avatars/nina.jpg'][swapTemplateIdx],
                      aspect: '9:16',
                      res: swapRes,
                      durationSec: 7,
                    })
                  }
                >
                  Generate
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10 }}>
                Swaps only the face and keeps the video&apos;s body, outfit and scene.
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: SEEDANCE 2.5 (Exact 1:1 u05_seedance.png)
            ========================================================= */}
        {activeTab === 'seedance' && (
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <h1 className="vs-studio-title">What will you create today?</h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
              <div className="vs-mode-pill-group">
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${seedanceSubMode === 'generate' ? 'active' : ''}`}
                  onClick={() => setSeedanceSubMode('generate')}
                >
                  <span>Generate Video</span>
                </button>
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${seedanceSubMode === 'reference' ? 'active' : ''}`}
                  onClick={() => setSeedanceSubMode('reference')}
                >
                  <span>Reference to Video</span>
                </button>
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${seedanceSubMode === 'frames' ? 'active' : ''}`}
                  onClick={() => setSeedanceSubMode('frames')}
                >
                  <span>Start &amp; End Frames</span>
                </button>
              </div>
            </div>

            <div className="vs-composer-card">
              {seedanceSubMode !== 'generate' && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <span className="vs-ctrl-pill">
                    <img src={selectedAvatar.image} alt="Ref 1" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover' }} />
                    <span>{seedanceSubMode === 'frames' ? 'Start Frame' : 'Reference #1'}</span>
                  </span>
                  {seedanceSubMode === 'frames' && (
                    <span className="vs-ctrl-pill">
                      <img src="/assets/showcase/seedance-cinema.jpg" alt="End Frame" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover' }} />
                      <span>End Frame</span>
                    </span>
                  )}
                </div>
              )}

              <textarea
                className="vs-clean-textarea"
                rows={5}
                placeholder="Describe your video. Example: A paper boat sails through a rain-soaked city as the camera follows at street level."
                value={seedancePrompt}
                onChange={(e) => setSeedancePrompt(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button
                    type="button"
                    className="vs-ctrl-pill"
                    style={{ width: 34, padding: 0, justifyContent: 'center' }}
                    onClick={() =>
                      setSeedancePrompt(
                        'Cinematic neo-noir Tokyo street in warm neon rain, camera tracking smoothly as our presenter walks forward in 2K anamorphic bokeh.'
                      )
                    }
                    title="Fill Sample Cinematic Prompt"
                  >
                    <Plus size={16} />
                  </button>

                  <select
                    className="vs-ctrl-pill"
                    value={seedanceModelId}
                    onChange={(e) => setSeedanceModelId(e.target.value)}
                    style={{ outline: 'none', cursor: 'pointer' }}
                  >
                    {AI_MODELS.filter((m) => m.category === 'video' || m.id === 'v-character-4').map((m) => (
                      <option key={m.id} value={m.id} style={{ background: '#161822' }}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="vs-ctrl-pill"
                    onClick={() => setSeedanceDuration((d) => (d === 10 ? 15 : d === 15 ? 5 : 10))}
                  >
                    <Sliders size={13} />
                    <span>{resolution} | {seedanceDuration}s | auto</span>
                    <ChevronDown size={13} style={{ opacity: 0.6 }} />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isRendering}
                  className="vs-circle-submit"
                  onClick={() =>
                    executeStudioRender({
                      workflow: 'seedance',
                      title: `${AI_MODELS.find((m) => m.id === seedanceModelId)?.name || 'Seedance 2.5'} Clip`,
                      script:
                        seedancePrompt.trim() ||
                        'A paper boat sails through a rain-soaked neon city at street level in cinematic slow motion.',
                      avatarImg: '/assets/showcase/seedance-cinema.jpg',
                      aspect: '16:9',
                      res: '1080p',
                      cinematic: true,
                      durationSec: seedanceDuration,
                      music: 'cinema',
                    })
                  }
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: VIDEO PODCAST (Exact 1:1 u06_podcast.png)
            ========================================================= */}
        {activeTab === 'podcast' && (
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <h1 className="vs-studio-title">Video Podcast</h1>

            {/* 2-Column Podcast Studio Composer Card */}
            <div
              className="vs-composer-card"
              style={{
                maxWidth: 760,
                display: 'grid',
                gridTemplateColumns: '260px 1fr',
                gap: 18,
                marginBottom: 42,
              }}
            >
              <div style={{ background: '#171923', borderRadius: 14, padding: 10 }}>
                <img
                  src={selectedPodcastStudio.image}
                  alt={selectedPodcastStudio.title}
                  style={{ width: '100%', height: 148, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }}
                />
                <div style={{ fontSize: '0.8rem', fontWeight: 650, padding: '0 4px' }}>
                  {selectedPodcastStudio.title}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <textarea
                  className="vs-clean-textarea"
                  rows={5}
                  placeholder="Describe what your podcast is about, including style, tone, etc. Or Add audio to start."
                  value={podcastPrompt}
                  onChange={(e) => setPodcastPrompt(e.target.value)}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      style={{ width: 34, padding: 0, justifyContent: 'center' }}
                      onClick={() =>
                        setPodcastPrompt(
                          'Host A & Host B debate how AI Video Agents and V-Character 4.0 let solo creators run global media studios.'
                        )
                      }
                    >
                      <Plus size={15} />
                    </button>
                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      onClick={() =>
                        setPodcastDurationLabel((d) => (d === '3 minutes' ? '5 minutes' : '3 minutes'))
                      }
                    >
                      <Clock size={13} />
                      <span>{podcastDurationLabel}</span>
                      <ChevronDown size={13} style={{ opacity: 0.6 }} />
                    </button>
                    <button
                      type="button"
                      className="vs-ctrl-pill"
                      onClick={() => setPodcastAutoTranslate((v) => !v)}
                    >
                      <Globe size={13} />
                      <span className={`vs-switch ${podcastAutoTranslate ? 'on' : ''}`}>
                        <span className="vs-switch-thumb" />
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isRendering}
                    className="vs-circle-submit"
                    onClick={() => {
                      const hostA = avatars.find((a) => a.id === selectedPodcastStudio.hostAId) || STOCK_AVATARS[0];
                      const hostB = avatars.find((a) => a.id === selectedPodcastStudio.hostBId) || STOCK_AVATARS[3];
                      executeStudioRender({
                        workflow: 'podcast',
                        title: `${selectedPodcastStudio.title} Episode`,
                        script:
                          podcastPrompt.trim() ||
                          'Welcome back to the studio! Today we are exploring how two-host AI video podcasts transform written research and NotebookLM audio into broadcast shows.',
                        avatarImg: hostA.image,
                        secondaryImg: hostB.image,
                        aspect: '16:9',
                        res: '1080p',
                        durationSec: 12,
                        music: 'podcast',
                      });
                    }}
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Select your podcast studio + Category Pills + 4 Studio Cards */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Select your podcast studio</h3>
              <button
                type="button"
                className="vs-btn vs-btn-secondary vs-btn-sm"
                onClick={() => avatarUploadRef.current?.click()}
              >
                + New Template
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {[
                'All',
                'My Studio',
                'AI & Technology',
                'Business',
                'Education',
                'Health & Care',
                'Personal Growth',
                'General',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPodcastCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: podcastCategory === cat ? '#272938' : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: podcastCategory === cat ? '#fff' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="vs-grid-4">
              {PODCAST_STUDIOS.filter(
                (st) => podcastCategory === 'All' || st.category === podcastCategory
              ).map((studio) => (
                <button
                  key={studio.id}
                  type="button"
                  onClick={() => setSelectedStudioId(studio.id)}
                  className="vs-card vs-card-interactive"
                  style={{
                    overflow: 'hidden',
                    textAlign: 'left',
                    borderColor: selectedStudioId === studio.id ? '#625df5' : undefined,
                  }}
                >
                  <img src={studio.image} alt={studio.title} style={{ width: '100%', height: 175, objectFit: 'cover' }} />
                  <div style={{ padding: '12px 14px', fontWeight: 650, fontSize: '0.88rem' }}>{studio.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 7: AI PRESENTATION (Exact 1:1 u07_presentation.png)
            ========================================================= */}
        {activeTab === 'presentation' && (
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <h1 className="vs-studio-title">Turn slides into engaging video</h1>

            <div className="vs-composer-card" style={{ maxWidth: 760, marginBottom: 38 }}>
              <input
                ref={pptUploadRef}
                type="file"
                accept=".pptx,.pdf,.key,.txt,image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setUploadedSlideName(f.name);
                    showToast(`Uploaded deck: ${f.name}`);
                  }
                }}
              />

              <div
                style={{
                  border: '1px dashed rgba(255,255,255,0.14)',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  padding: '38px 20px',
                  textAlign: 'center',
                  marginBottom: 14,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.96rem', marginBottom: 6 }}>
                  {uploadedSlideName ? `Deck Ready: ${uploadedSlideName}` : 'Drag your file to start uploading'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 18 }}>
                  Supported formats: .pptx / .keynote. We only support up to 30 slides per PPT.
                </div>
                <button
                  type="button"
                  className="vs-btn vs-btn-primary vs-btn-sm"
                  style={{ height: 38, padding: '0 22px' }}
                  onClick={() => pptUploadRef.current?.click()}
                >
                  <Upload size={14} /> Upload
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="vs-ctrl-pill"
                    onClick={() => setPptDurationLabel((d) => (d === '3 minutes' ? '5 minutes' : '3 minutes'))}
                  >
                    <span>{pptDurationLabel}</span>
                    <ChevronDown size={13} style={{ opacity: 0.6 }} />
                  </button>

                  <button
                    type="button"
                    className="vs-ctrl-pill"
                    onClick={() => setPptAiScript((v) => !v)}
                  >
                    <Sparkles size={13} />
                    <span>AI Script</span>
                    <span className={`vs-switch ${pptAiScript ? 'on' : ''}`}>
                      <span className="vs-switch-thumb" />
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isRendering}
                  className="vs-circle-submit"
                  onClick={() =>
                    executeStudioRender({
                      workflow: 'presentation',
                      title: uploadedSlideName || 'A Step-by-Step Guide to AI Presentation',
                      script: slideOutline.join('. '),
                      avatarImg: selectedAvatar.image,
                      aspect: '16:9',
                      res: '1080p',
                      durationSec: 12,
                      shots: slideOutline.map((sl, i) => ({
                        id: `sl_${i}`,
                        shotNumber: i + 1,
                        title: sl.split(':')[0] || `Slide ${i + 1}`,
                        visualPrompt: sl,
                        script: sl,
                        durationSec: 4,
                        cameraMotion: 'Medium Presenter + Slide PiP',
                      })),
                    })
                  }
                  title="Generate Slide Video"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>

            {/* Recent Creations matching u07_presentation.png */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Recent Creations</span>
              <span className="vs-tag" style={{ background: '#252736', color: '#fff' }}>All</span>
              <span className="vs-tag">Draft</span>
              <span className="vs-tag">Video</span>
            </div>

            <div className="vs-grid-3">
              <div
                className="vs-card vs-card-interactive"
                style={{ overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => {
                  setSlideOutline([
                    'Slide 1: Transform Any Deck Into Dynamic Talking Videos with AI',
                    'Slide 2: Presenter Picture-in-Picture & Automatic AI Narration',
                    'Slide 3: Export 1080p & 2K Training Videos in 88 Languages',
                  ]);
                  showToast('Loaded sample AI Presentation deck — click ↑ to render!');
                }}
              >
                <div
                  style={{
                    height: 185,
                    background: '#0d0e16',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <VisionStoryPrismLogo size={36} boxed={false} />
                  <div style={{ fontWeight: 800, marginTop: 8 }}>
                    Vision<span style={{ color: '#625df5' }}>Story</span>
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      padding: '2px 9px',
                      borderRadius: 999,
                      background: '#eab308',
                      color: '#000',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                    }}
                  >
                    New
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      fontSize: '0.72rem',
                      background: 'rgba(255,255,255,0.08)',
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    02:38 · 1080p
                  </span>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 650, fontSize: '0.86rem' }}>A Step-by-Step Guide to AI Presentation</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>Template Deck</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 8: AI TOOLS (Exact 1:1 u08_tools.png + Interactive Workbench)
            ========================================================= */}
        {activeTab === 'ai-tools' && (
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            {activeInlineSubTool ? (
              <div>
                <button
                  type="button"
                  onClick={() => setActiveInlineSubTool(null)}
                  className="vs-btn vs-btn-secondary vs-btn-sm"
                  style={{ marginBottom: 18 }}
                >
                  <ArrowLeft size={14} /> Back to AI Tools
                </button>
                <StudioToolsPanel
                  initialSubTool={activeInlineSubTool}
                  onAvatarCreated={(newId) => {
                    setSelectedAvatarId(newId);
                    setActiveTab('ai-video');
                  }}
                />
              </div>
            ) : (
              <>
                <h1 className="vs-studio-title" style={{ marginBottom: 6 }}>AI Tools</h1>
                <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 28 }}>
                  Use VisionStory Tools to level up your creative process
                </p>

                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 12 }}>Trending</div>
                <div className="vs-grid-3" style={{ marginBottom: 32 }}>
                  {[
                    {
                      title: 'AI Video Generator',
                      desc: 'Create AI-generated video clips for your projects.',
                      img: '/assets/avatars/olivia.jpg',
                      action: () => setActiveTab('seedance'),
                      icon: <VsIconAiVideo />,
                    },
                    {
                      title: 'Music Video',
                      desc: 'Turn sound into a visual story.',
                      img: '/assets/showcase/music-singer.jpg',
                      action: () => setActiveTab('viral-music'),
                      icon: <VsIconViralMusic />,
                    },
                    {
                      title: 'Face Swap',
                      desc: 'Instant face replacement for your video clips.',
                      img: '/assets/avatars/elena.jpg',
                      action: () => setActiveTab('face-swap'),
                      icon: <VsIconFaceSwap />,
                    },
                  ].map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={item.action}
                      className="vs-card vs-card-interactive"
                      style={{
                        height: 205,
                        position: 'relative',
                        overflow: 'hidden',
                        padding: 18,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.52 }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(10,11,16,0.18) 0%, rgba(10,11,16,0.92) 100%)',
                        }}
                      />
                      <span
                        style={{
                          position: 'relative',
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: 'rgba(255,255,255,0.12)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </span>
                      <div style={{ position: 'relative' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.06rem', marginBottom: 2 }}>{item.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="vs-underline-tabs" style={{ marginBottom: 20 }}>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'video', label: 'For videos' },
                    { id: 'image', label: 'For images' },
                    { id: 'audio', label: 'For audio' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`vs-underline-tab ${toolsCategoryTab === t.id ? 'active' : ''}`}
                      onClick={() => setToolsCategoryTab(t.id as typeof toolsCategoryTab)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="vs-grid-3">
                  {CREATOR_TOOLS.filter((tool) => {
                    if (toolsCategoryTab === 'all') return true;
                    if (toolsCategoryTab === 'video') return tool.category === 'video' || tool.category === 'avatar';
                    if (toolsCategoryTab === 'audio') return tool.category === 'voice';
                    return tool.category === 'image';
                  }).map((tool) => (
                    <button
                      key={tool.slug}
                      type="button"
                      onClick={() => {
                        if (tool.studioSubTool) {
                          setActiveInlineSubTool(tool.studioSubTool);
                        } else {
                          setActiveTab(tool.studioTab as SidebarTabId);
                        }
                      }}
                      className="vs-card vs-card-interactive"
                      style={{
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        textAlign: 'left',
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          background: '#1a1c28',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <VsIconTools />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{tool.titleEn}</span>
                          {tool.badge && <span className="vs-tag-duet">{tool.badge}</span>}
                        </div>
                        <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {tool.descEn}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 9: LIBRARY
            ========================================================= */}
        {activeTab === 'library' && (
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Library</h2>
              <button type="button" className="vs-btn vs-btn-primary vs-btn-sm" onClick={() => setActiveTab('ai-video')}>
                + New Video
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="vs-card" style={{ padding: '72px 24px', textAlign: 'center' }}>
                <VisionStoryPrismLogo size={42} boxed={false} />
                <div style={{ fontWeight: 700, marginTop: 14, marginBottom: 6 }}>No creations yet</div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 18 }}>
                  Videos you generate in AI Video, AI Agent, Viral Music, Podcast, or Face Swap appear here automatically.
                </p>
                <button type="button" className="vs-btn vs-btn-primary vs-btn-sm" onClick={() => setActiveTab('ai-video')}>
                  Create First Video
                </button>
              </div>
            ) : (
              <div className="vs-grid-3">
                {projects.map((proj) => {
                  const vidUrl = videoBlobMap[proj.id] || proj.videoDataUrl;
                  return (
                    <div key={proj.id} className="vs-card" style={{ overflow: 'hidden' }}>
                      <div style={{ position: 'relative', height: 195, background: '#090a10' }}>
                        {vidUrl ? (
                          <video
                            src={vidUrl}
                            poster={proj.avatarImage}
                            controls
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img src={proj.avatarImage} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {proj.title}
                          </div>
                          <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                            {proj.resolution} · {proj.aspectRatio} · {proj.durationSec}s
                          </div>
                        </div>
                        {vidUrl && (
                          <a
                            href={vidUrl}
                            download={`${proj.title.replace(/\s+/g, '_')}.webm`}
                            className="vs-btn vs-btn-secondary vs-btn-sm"
                          >
                            <Download size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 10: PRICING IN STUDIO (Exact 1:1 09_pricing.png)
            ========================================================= */}
        {activeTab === 'pricing' && (
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ fontWeight: 700, fontSize: '1.12rem', marginBottom: 18 }}>Choose Your Plan</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 42 }}>
              <div style={{ flex: 1 }} />
              <div className="vs-mode-pill-group">
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${studioPricingCycle === 'monthly' ? 'active' : ''}`}
                  onClick={() => setStudioPricingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`vs-mode-pill-btn ${studioPricingCycle === 'annual' ? 'active' : ''}`}
                  onClick={() => setStudioPricingCycle('annual')}
                >
                  <span>Annually</span>
                  <span style={{ color: '#f43f5e', fontSize: '0.74rem', fontWeight: 700 }}>save 2 months</span>
                </button>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Link href="/pricing" className="vs-btn vs-btn-secondary vs-btn-sm">
                  Enterprise
                </Link>
              </div>
            </div>

            {/* 3 Paid Plan Cards (Pro, Advanced, Ultra) matching 09_pricing.png */}
            <div className="vs-grid-3">
              {PRICING_PLANS.filter((p) => p.id !== 'free').map((plan) => {
                const price = studioPricingCycle === 'annual' ? plan.annualMonthlyEquivalent : plan.monthlyPrice;
                return (
                  <div key={plan.id} className={`vs-plan-card ${plan.popular ? 'popular' : ''}`}>
                    {plan.popular && <div className="vs-plan-popular-ribbon">Most Popular</div>}
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 14 }}>{plan.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                      <span style={{ fontSize: '2.4rem', fontWeight: 800 }}>${price}</span>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>/mo</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlanUpgrade(plan)}
                      className="vs-btn vs-btn-white"
                      style={{ width: '100%', height: 42, marginBottom: 14 }}
                    >
                      {user.plan === plan.id ? 'Current Plan ✓' : 'Subscribe'}
                    </button>
                    <div
                      style={{
                        height: 38,
                        borderRadius: 9,
                        background: '#1c1e29',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 14px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        marginBottom: 20,
                      }}
                    >
                      {plan.monthlyCredits} credits
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 8 }}>Video generation:</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                      {plan.videoGenFeaturesEn.map((f) => (
                        <li key={f} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', display: 'flex', gap: 8 }}>
                          <span style={{ color: '#605CF7', fontWeight: 800 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 8 }}>{plan.plusTitleEn}</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {plan.plusFeaturesEn.map((f) => (
                        <li key={f} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)', display: 'flex', gap: 8 }}>
                          <span style={{ color: '#605CF7', fontWeight: 800 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 11: BILLING (Exact 1:1 u10_billing.png)
            ========================================================= */}
        {activeTab === 'billing' && (
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 16 }}>Billing</h2>

            <div className="vs-underline-tabs" style={{ marginBottom: 20 }}>
              <button
                type="button"
                className={`vs-underline-tab ${billingSubTab === 'history' ? 'active' : ''}`}
                onClick={() => setBillingSubTab('history')}
              >
                Billing History
              </button>
              <button
                type="button"
                className={`vs-underline-tab ${billingSubTab === 'usage' ? 'active' : ''}`}
                onClick={() => setBillingSubTab('usage')}
              >
                Credit Usage
              </button>
            </div>

            {billingSubTab === 'history' ? (
              <div
                className="vs-card"
                style={{
                  minHeight: 480,
                  padding: '22px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Paid Bills and Receipts
                  </span>
                  <button
                    type="button"
                    onClick={() => setLedgerModalOpen(true)}
                    className="vs-btn vs-btn-secondary vs-btn-sm"
                  >
                    Manage Billing Info
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.38, margin: 'auto 0' }}>
                  <VisionStoryPrismLogo size={54} boxed={false} />
                </div>
              </div>
            ) : (
              <div className="vs-card" style={{ padding: 20 }}>
                {ledger.map((tx) => (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 8px',
                      borderBottom: '1px solid var(--border-hairline)',
                      fontSize: '0.84rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{tx.description}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {new Date(tx.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: tx.amount >= 0 ? 'var(--accent-teal)' : '#a59eff' }}>
                      {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} credits
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 12: API IN STUDIO
            ========================================================= */}
        {activeTab === 'api' && (
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>VisionStory OpenAPI Keys</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Authenticate against POST /api/v1/video, Python SDK, VisionStory CLI, and MCP Server.
                </p>
              </div>
              <Link href="/openapi" className="vs-btn vs-btn-secondary vs-btn-sm">
                Full API Docs ↗
              </Link>
            </div>

            <form onSubmit={handleCreateStudioApiKey} className="vs-card" style={{ padding: 20, display: 'flex', gap: 10, marginBottom: 18 }}>
              <input
                type="text"
                className="vs-input"
                value={newApiKeyName}
                onChange={(e) => setNewApiKeyName(e.target.value)}
                placeholder="Key label (e.g., CI Pipeline)"
              />
              <button type="submit" className="vs-btn vs-btn-primary vs-btn-sm">
                + Create Key
              </button>
            </form>

            {freshRawApiKey && (
              <div
                className="vs-card"
                style={{
                  padding: 16,
                  marginBottom: 18,
                  borderColor: 'var(--accent-teal)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.83rem',
                }}
              >
                New API Key: <strong>{freshRawApiKey}</strong>
              </div>
            )}

            <div className="vs-card" style={{ padding: 18 }}>
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 6px',
                    borderBottom: '1px solid var(--border-hairline)',
                    fontSize: '0.84rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 650 }}>{k.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}>
                      {k.rawPreview}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="vs-btn-ghost"
                    onClick={async () => {
                      await fetch('/api/state', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'revoke_api_key', keyId: k.id }),
                      });
                      await refreshState();
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom-Right Headset Support Button matching u01_ai_video.png */}
      <button
        type="button"
        className="vs-support-fab"
        onClick={() => showToast('VisionStory Support: feedback@visionstory.ai · All engines online!')}
        title="Support & Feedback"
      >
        <Headphones size={18} />
      </button>

      {/* Rendered Video Playback Modal */}
      {activeVideoModal && (
        <div className="vs-modal-backdrop" onClick={() => setActiveVideoModal(null)}>
          <div className="vs-modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 className="vs-h3">{activeVideoModal.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {activeVideoModal.resolution} · {activeVideoModal.durationSec}s · WebM Stereo
                </p>
              </div>
              <button type="button" className="vs-btn-ghost" onClick={() => setActiveVideoModal(null)}>
                <X size={18} />
              </button>
            </div>

            <video
              src={activeVideoModal.videoUrl}
              controls
              autoPlay
              style={{ width: '100%', maxHeight: 440, borderRadius: 14, background: '#000', marginBottom: 16 }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="vs-btn vs-btn-secondary vs-btn-sm"
                onClick={() => {
                  setActiveVideoModal(null);
                  setActiveTab('library');
                }}
              >
                View in Library
              </button>
              <a
                href={activeVideoModal.videoUrl}
                download={`${activeVideoModal.title.replace(/\s+/g, '_')}.webm`}
                className="vs-btn vs-btn-primary vs-btn-sm"
              >
                <Download size={14} /> Download Video (.webm)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
