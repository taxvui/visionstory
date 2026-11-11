'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Bot,
  Clapperboard,
  Coins,
  Download,
  Film,
  Layers,
  Mic,
  Music,
  Play,
  Plus,
  Presentation,
  Send,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  Wand2,
  Wrench,
} from 'lucide-react';
import { useVisionStory } from '@/components/VisionStoryProvider';
import {
  AspectRatioOption,
  calculateCredits,
  estimateScriptDurationSec,
  ResolutionOption,
  StudioWorkflowType,
} from '@/lib/credits';
import { ProjectRecord, StoryboardShot } from '@/lib/db';
import { AI_MODELS } from '@/lib/catalog';
import { renderStudioVideo } from '@/lib/videoRenderer';
import { speakScript, stopSpeaking } from '@/lib/audioEngine';
import { StudioToolsPanel } from './StudioToolsPanel';

export function StudioWorkspace() {
  const searchParams = useSearchParams();
  const {
    locale,
    t,
    user,
    avatars,
    voices,
    projects,
    refreshState,
    showToast,
    setLedgerModalOpen,
  } = useVisionStory();

  // Active Studio Workflow Tab
  const [activeTab, setActiveTab] = useState<StudioWorkflowType>('ai-video');
  const [initialSubTool, setInitialSubTool] = useState<string>('voice-clone');

  // Shared Generation Controls
  const [videoMode, setVideoMode] = useState<'presenter' | 'cinematic'>('presenter');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('av_aria_v4');
  const [secondaryAvatarId, setSecondaryAvatarId] = useState<string>('av_marcus_v4');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('voice_alloy');
  const [secondaryVoiceId, setSecondaryVoiceId] = useState<string>('voice_echo');
  const [inputSubTab, setInputSubTab] = useState<'script' | 'audio' | 'music'>('script');

  const [script, setScript] = useState<string>(
    'Welcome to VisionStory! Upload a single photo, write your script in any of 88 languages, and V-Character 4.0 brings your presenter to life with natural expressions and accurate lip-sync.'
  );
  const [motionPrompt, setMotionPrompt] = useState<string>(
    'Warm studio key lighting, natural hand gestures, subtle confident head nods'
  );
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('9:16');
  const [resolution, setResolution] = useState<ResolutionOption>('720p');
  const [greenScreen, setGreenScreen] = useState<boolean>(false);
  const [showBillPopover, setShowBillPopover] = useState<boolean>(false);

  // AI Agent Storyboard State
  const [agentBrief, setAgentBrief] = useState<string>(
    'Launch our SaaS AI customer support copilot that cuts ticket response time by 70%.'
  );
  const [agentShots, setAgentShots] = useState<StoryboardShot[]>([
    {
      id: 'shot_1',
      shotNumber: 1,
      title: 'Attention Hook',
      script: 'Still spending hours answering repetitive support tickets manually every morning?',
      visualPrompt: 'Close-up presenter hook in warm modern studio',
      cameraMotion: 'Slow Dolly In',
      durationSec: 4,
    },
    {
      id: 'shot_2',
      shotNumber: 2,
      title: 'Solution Walkthrough',
      script: 'Meet our AI Copilot — it resolves seventy percent of customer questions automatically in eighty-eight languages.',
      visualPrompt: 'Medium shot with subtle product metric callout',
      cameraMotion: 'Subtle Pan Right',
      durationSec: 5,
    },
    {
      id: 'shot_3',
      shotNumber: 3,
      title: 'Call to Action',
      script: 'Start your free workspace today and ship instant answers around the clock.',
      visualPrompt: 'Centered presenter close-up with bold CTA subtitle',
      cameraMotion: 'Studio Locked Shot',
      durationSec: 4,
    },
  ]);
  const [agentChatInput, setAgentChatInput] = useState<string>('');
  const [agentChatLog, setAgentChatLog] = useState<string[]>([
    'Agent ready: 3-shot storyboard prepared. Ask me to revise any shot, add pricing, or translate to Vietnamese!',
  ]);
  const [planningAgent, setPlanningAgent] = useState<boolean>(false);

  // Viral Music State
  const [songLink, setSongLink] = useState<string>('https://suno.com/song/crimson-neon-skyline');
  const [musicStyle, setMusicStyle] = useState<string>('Synthwave Pop');
  const [lyricsText, setLyricsText] = useState<string>(
    'Under crimson studio lights we rise tonight, turning one still portrait into cinema motion.'
  );

  // Face Swap State
  const [faceSwapTargetImg, setFaceSwapTargetImg] = useState<string>('/assets/showcase/music-singer.jpg');

  // Seedance 2.5 / Video Models State
  const [selectedVideoModel, setSelectedVideoModel] = useState<string>('seedance-2.5');
  const [seedanceSubMode, setSeedanceSubMode] = useState<string>('Text To Video');
  const [seedanceDuration, setSeedanceDuration] = useState<number>(8);
  const [seedancePrompt, setSeedancePrompt] = useState<string>(
    'Sleek matte-silver electric sports coupe gliding through rain-lit Tokyo neon streets at dusk, anamorphic lens flare'
  );

  // Video Podcast State
  const [podcastLines, setPodcastLines] = useState<Array<{ host: 'A' | 'B'; text: string }>>([
    { host: 'A', text: 'Welcome back to Deep Dive! Today we are testing how single-photo AI hosts transform audio podcasts.' },
    { host: 'B', text: 'What impressed me most is NotebookLM audio support — upload an MP3 and both speakers animate automatically.' },
    { host: 'A', text: 'Exactly, and creators can publish vertical clips for Reels and full 16:9 episodes for YouTube in minutes.' },
  ]);

  // AI Presentation State
  const [slides, setSlides] = useState<StoryboardShot[]>([
    {
      id: 'slide_1',
      shotNumber: 1,
      title: 'Q4 Global Product Expansion',
      visualPrompt: 'Revenue grew 142% YoY across 18 localized markets using automated video onboarding.',
      script: 'Welcome team! Let us review our fourth-quarter global expansion highlights.',
      cameraMotion: 'Slide 01',
      durationSec: 5,
    },
    {
      id: 'slide_2',
      shotNumber: 2,
      title: 'Automated L&D & Customer Onboarding',
      visualPrompt: 'Converted 45 static training decks into presenter-led video modules in 88 languages.',
      script: 'By turning static decks into AI-hosted videos, onboarding completion jumped to ninety-two percent.',
      cameraMotion: 'Slide 02',
      durationSec: 5,
    },
  ]);

  // Rendering & Active Player State
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [activeProject, setActiveProject] = useState<ProjectRecord | null>(null);
  const [renderedVideoUrls, setRenderedVideoUrls] = useState<Record<string, string>>({});

  // Sync URL query parameters on load
  useEffect(() => {
    const tabParam = searchParams.get('tab') as StudioWorkflowType | null;
    if (
      tabParam &&
      ['ai-video', 'ai-agent', 'viral-music', 'face-swap', 'seedance', 'podcast', 'presentation', 'ai-tools'].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
    const avatarParam = searchParams.get('avatar');
    if (avatarParam) setSelectedAvatarId(avatarParam);
    const voiceParam = searchParams.get('voice');
    if (voiceParam) setSelectedVoiceId(voiceParam);
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setScript(promptParam);
      setSeedancePrompt(promptParam);
      setAgentBrief(promptParam);
    }
    const modelParam = searchParams.get('model');
    if (modelParam) setSelectedVideoModel(modelParam);
    const gsParam = searchParams.get('greenscreen');
    if (gsParam === '1') setGreenScreen(true);
    const toolParam = searchParams.get('tool');
    if (toolParam) setInitialSubTool(toolParam);
  }, [searchParams]);

  useEffect(() => {
    if (!activeProject && projects.length > 0) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject]);

  const activeAvatar = useMemo(
    () => avatars.find((a) => a.id === selectedAvatarId) || avatars[0],
    [avatars, selectedAvatarId]
  );

  const secondaryAvatar = useMemo(
    () => avatars.find((a) => a.id === secondaryAvatarId) || avatars[1] || avatars[0],
    [avatars, secondaryAvatarId]
  );

  const activeVoice = useMemo(
    () => voices.find((v) => v.id === selectedVoiceId) || voices[0],
    [voices, selectedVoiceId]
  );

  // Live Estimated Duration & Credit Bill
  const effectiveScript = useMemo(() => {
    if (activeTab === 'ai-agent') return agentShots.map((s) => s.script).join(' ');
    if (activeTab === 'viral-music') return lyricsText;
    if (activeTab === 'podcast') return podcastLines.map((l) => l.text).join(' ');
    if (activeTab === 'presentation') return slides.map((s) => s.script).join(' ');
    if (activeTab === 'seedance') return seedancePrompt;
    return script;
  }, [activeTab, agentShots, lyricsText, podcastLines, slides, seedancePrompt, script]);

  const estimatedDurationSec = useMemo(() => {
    if (activeTab === 'seedance') return seedanceDuration;
    if (activeTab === 'face-swap') return 8;
    if (activeTab === 'ai-agent') {
      return agentShots.reduce((acc, s) => acc + (s.durationSec || 4), 0);
    }
    if (activeTab === 'presentation') {
      return slides.reduce((acc, s) => acc + (s.durationSec || 5), 0);
    }
    return estimateScriptDurationSec(effectiveScript, speed);
  }, [activeTab, seedanceDuration, agentShots, slides, effectiveScript, speed]);

  const creditBill = useMemo(
    () =>
      calculateCredits({
        workflow: activeTab,
        durationSec: estimatedDurationSec,
        resolution,
        greenScreen,
        cinematicMode: videoMode === 'cinematic',
        modelId: selectedVideoModel,
        slidesCount: slides.length,
      }),
    [activeTab, estimatedDurationSec, resolution, greenScreen, videoMode, selectedVideoModel, slides.length]
  );

  // Custom Avatar Photo Upload Handler
  const handleCustomPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result !== 'string') return;
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_custom_avatar',
          name: file.name.replace(/\.[^.]+$/, '').slice(0, 22) || 'Uploaded Portrait',
          image: reader.result,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        await refreshState();
        setSelectedAvatarId(data.avatar.id);
        showToast('Uploaded custom portrait and selected for talking video!');
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Video Agent Plan & Chat Revision Handlers
  const handlePlanAgentStoryboard = async () => {
    setPlanningAgent(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: agentBrief, locale }),
      });
      if (res.ok) {
        const data = await res.json();
        setAgentShots(data.shots);
        setAgentChatLog((prev) => [
          ...prev,
          `Planned ${data.shots.length}-shot storyboard (${data.provider}): "${data.title}"`,
        ]);
      }
    } finally {
      setPlanningAgent(false);
    }
  };

  const handleReviseAgentStoryboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentChatInput.trim()) return;
    const instruction = agentChatInput.trim();
    setAgentChatInput('');
    setAgentChatLog((prev) => [...prev, `You: ${instruction}`]);

    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'revise',
        instruction,
        shots: agentShots,
        locale,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setAgentShots(data.shots);
      setAgentChatLog((prev) => [...prev, `Agent: ${data.reply}`]);
    }
  };

  // Core Video Render + Credit Settlement Handler
  const handleGenerateVideo = async () => {
    if (isRendering) return;
    setIsRendering(true);
    setRenderProgress(4);

    try {
      const activeShots =
        activeTab === 'ai-agent'
          ? agentShots
          : activeTab === 'presentation'
          ? slides
          : undefined;

      const primaryVisual =
        activeTab === 'seedance'
          ? AI_MODELS.find((m) => m.apiId === selectedVideoModel)?.showcaseImage ||
            '/assets/showcase/seedance-cinema.jpg'
          : activeTab === 'face-swap'
          ? faceSwapTargetImg
          : activeAvatar?.image || '/assets/avatars/aria.jpg';

      const secondaryVisual =
        activeTab === 'podcast'
          ? secondaryAvatar?.image
          : activeTab === 'face-swap'
          ? activeAvatar?.image
          : undefined;

      // 1. Create & bill project via backend API
      const createRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow: activeTab,
          mode: videoMode,
          modelId: activeTab === 'seedance' ? selectedVideoModel : 'vs_character_v4',
          avatarId: activeAvatar?.id,
          secondaryAvatarId: secondaryAvatar?.id,
          avatarImage: primaryVisual,
          secondaryAvatarImage: secondaryVisual,
          voiceId: selectedVoiceId,
          secondaryVoiceId,
          script: effectiveScript,
          motionPrompt,
          resolution,
          aspectRatio: activeTab === 'presentation' || activeTab === 'podcast' ? '16:9' : aspectRatio,
          greenScreen,
          speed,
          durationSec: estimatedDurationSec || 8,
          shots: activeShots,
          musicStyle,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        showToast(createData.error || 'Unable to start generation');
        setIsRendering(false);
        return;
      }

      // 2. Render real WebM video on Canvas with stereo audio & synchronized captions
      const rendered = await renderStudioVideo({
        workflow: activeTab,
        title: createData.project.title,
        script: effectiveScript,
        avatarImage: primaryVisual,
        secondaryAvatarImage: secondaryVisual,
        aspectRatio: createData.project.aspectRatio,
        resolution,
        greenScreen,
        cinematic: videoMode === 'cinematic',
        durationSec: createData.project.durationSec,
        shots: activeShots,
        musicStyle,
        watermark: user.plan === 'free',
        onProgress: (pct) => setRenderProgress(pct),
      });

      setRenderedVideoUrls((prev) => ({
        ...prev,
        [createData.project.id]: rendered.videoUrl,
      }));
      setActiveProject(createData.project);
      await refreshState();

      // Speak voiceover preview automatically for presenter workflows
      if (['ai-video', 'ai-agent', 'podcast', 'presentation'].includes(activeTab)) {
        speakScript({
          text: effectiveScript.slice(0, 260),
          voice: activeVoice,
          speed,
        });
      }

      showToast(
        locale === 'vi'
          ? `Đã dựng xong video (${resolution})! Bạn có thể phát và tải file .webm ngay bên phải.`
          : `Video rendered (${resolution})! Play with AI voice or download .webm in the player.`
      );
    } catch (err) {
      console.error(err);
      showToast('Video rendering encountered an error — please try again.');
    } finally {
      setIsRendering(false);
      setRenderProgress(0);
    }
  };

  const handleRenderExistingProject = async (proj: ProjectRecord) => {
    setActiveProject(proj);
    if (renderedVideoUrls[proj.id]) return;
    setIsRendering(true);
    try {
      const rendered = await renderStudioVideo({
        workflow: proj.workflow,
        title: proj.title,
        script: proj.script,
        avatarImage: proj.avatarImage,
        secondaryAvatarImage: proj.secondaryAvatarImage,
        aspectRatio: proj.aspectRatio,
        resolution: proj.resolution,
        greenScreen: proj.greenScreen,
        cinematic: proj.mode === 'cinematic',
        durationSec: proj.durationSec,
        shots: proj.shots,
        watermark: user.plan === 'free',
        onProgress: (pct) => setRenderProgress(pct),
      });
      setRenderedVideoUrls((prev) => ({ ...prev, [proj.id]: rendered.videoUrl }));
    } finally {
      setIsRendering(false);
      setRenderProgress(0);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    stopSpeaking();
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_project', projectId }),
    });
    await refreshState();
    if (activeProject?.id === projectId) {
      setActiveProject(projects.find((p) => p.id !== projectId) || null);
    }
  };

  const SIDEBAR_TABS: Array<{ id: StudioWorkflowType; icon: React.ReactNode; label: string }> = [
    { id: 'ai-video', icon: <Clapperboard size={17} />, label: t.studio.tabs['ai-video'] },
    { id: 'ai-agent', icon: <Bot size={17} />, label: t.studio.tabs['ai-agent'] },
    { id: 'viral-music', icon: <Music size={17} />, label: t.studio.tabs['viral-music'] },
    { id: 'face-swap', icon: <Wand2 size={17} />, label: t.studio.tabs['face-swap'] },
    { id: 'seedance', icon: <Film size={17} />, label: t.studio.tabs.seedance },
    { id: 'podcast', icon: <Mic size={17} />, label: t.studio.tabs.podcast },
    { id: 'presentation', icon: <Presentation size={17} />, label: t.studio.tabs.presentation },
    { id: 'ai-tools', icon: <Wrench size={17} />, label: t.studio.tabs['ai-tools'] },
  ];

  return (
    <div className="vs-studio-shell">
      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="vs-studio-sidebar" aria-label="Studio workflows">
        {SIDEBAR_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`studio-tab-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`vs-studio-tab-btn ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div
          style={{
            marginTop: 'auto',
            padding: 12,
            borderRadius: 12,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Plan</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.86rem' }}>
              {user.plan}
            </span>
            <button
              type="button"
              onClick={() => setLedgerModalOpen(true)}
              style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: 650 }}
            >
              {user.credits} cr →
            </button>
          </div>
        </div>
      </aside>

      {/* CENTER WORKSPACE */}
      <section className="vs-studio-main">
        {activeTab === 'ai-tools' ? (
          <StudioToolsPanel
            initialSubTool={initialSubTool}
            onAvatarCreated={(newId) => {
              setSelectedAvatarId(newId);
              setActiveTab('ai-video');
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 820 }}>
            {/* WORKFLOW 1: AI TALKING VIDEO */}
            {activeTab === 'ai-video' && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div className="vs-segmented">
                    <button
                      type="button"
                      className={`vs-segmented-btn ${videoMode === 'presenter' ? 'active' : ''}`}
                      onClick={() => setVideoMode('presenter')}
                    >
                      {t.studio.presenter} (V-Character 4.0)
                    </button>
                    <button
                      type="button"
                      className={`vs-segmented-btn ${videoMode === 'cinematic' ? 'active' : ''}`}
                      onClick={() => setVideoMode('cinematic')}
                    >
                      {t.studio.cinematic} (V-Character 5.0 Pro)
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <label className="vs-btn vs-btn-secondary vs-btn-sm" style={{ cursor: 'pointer' }}>
                      <Upload size={14} /> {t.studio.uploadImage}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleCustomPhotoUpload(f);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="vs-btn vs-btn-secondary vs-btn-sm"
                      onClick={() => {
                        setInitialSubTool('image-gen');
                        setActiveTab('ai-tools');
                      }}
                    >
                      <Sparkles size={14} /> {t.studio.generateImage}
                    </button>
                  </div>
                </div>

                {/* Avatar Picker Grid */}
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    Select Talking Avatar ({avatars.length} Available · 1-Photo Consistent Character)
                  </div>
                  <div className="vs-avatar-grid">
                    {avatars.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setSelectedAvatarId(av.id);
                          setSelectedVoiceId(av.defaultVoiceId);
                        }}
                        className={`vs-avatar-tile ${selectedAvatarId === av.id ? 'selected' : ''}`}
                      >
                        <img src={av.image} alt={av.name} />
                        <div className="vs-avatar-tile-label">{av.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Script / Audio / Music Tabs */}
                <div className="vs-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div className="vs-segmented">
                      {(['script', 'audio', 'music'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          className={`vs-segmented-btn ${inputSubTab === st ? 'active' : ''}`}
                          onClick={() => setInputSubTab(st)}
                        >
                          {st === 'script'
                            ? t.studio.scriptTab
                            : st === 'audio'
                            ? t.studio.audioTab
                            : t.studio.musicTab}
                        </button>
                      ))}
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Est. {estimatedDurationSec}s
                    </span>
                  </div>

                  {inputSubTab === 'script' && (
                    <textarea
                      className="vs-textarea"
                      placeholder={t.studio.whatSay}
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                    />
                  )}

                  {inputSubTab === 'audio' && (
                    <div
                      style={{
                        padding: 22,
                        borderRadius: 12,
                        border: '1px dashed var(--border-strong)',
                        textAlign: 'center',
                        background: 'var(--bg-elevated)',
                      }}
                    >
                      <div style={{ fontWeight: 650, marginBottom: 4 }}>
                        Add Audio · MP3, WAV, M4A, MP4, MOV, or WebM
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                        Your avatar lip-syncs frame-by-frame to your uploaded or recorded voiceover
                      </div>
                      <label className="vs-btn vs-btn-secondary vs-btn-sm" style={{ cursor: 'pointer' }}>
                        <Upload size={14} /> Upload Audio Script
                        <input
                          type="file"
                          accept="audio/*,video/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setScript(`Audio performance synced from uploaded file: ${f.name}`);
                              showToast(`Loaded audio script: ${f.name}`);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {inputSubTab === 'music' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {['None (Clean Voice)', 'Warm Corporate Ambient', 'Subtle Tech Pulse', 'Upbeat Creator Lo-Fi'].map(
                        (m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMusicStyle(m)}
                            className={musicStyle === m ? 'vs-tag vs-tag-brand' : 'vs-tag'}
                            style={{ padding: '7px 13px', cursor: 'pointer' }}
                          >
                            {m}
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {/* Voice, Clone, Preview & Speed Bar */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: '1px solid var(--border-hairline)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                      <select
                        className="vs-select"
                        style={{ width: 'auto', padding: '7px 12px', fontSize: '0.84rem' }}
                        value={selectedVoiceId}
                        onChange={(e) => setSelectedVoiceId(e.target.value)}
                      >
                        {voices.map((v) => (
                          <option key={v.id} value={v.id}>
                            🎙 {v.name} · {v.language}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        className="vs-btn vs-btn-secondary vs-btn-sm"
                        onClick={() =>
                          speakScript({
                            text: script || activeVoice.sampleText,
                            voice: activeVoice,
                            speed,
                          })
                        }
                      >
                        <Volume2 size={14} /> {t.studio.previewAudio}
                      </button>

                      <button
                        type="button"
                        className="vs-btn vs-btn-secondary vs-btn-sm"
                        onClick={() => {
                          setInitialSubTool('voice-clone');
                          setActiveTab('ai-tools');
                        }}
                      >
                        <Mic size={14} /> {t.studio.cloneVoice}
                      </button>
                    </div>

                    <div className="vs-segmented">
                      {(['slow', 'normal', 'fast'] as const).map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          className={`vs-segmented-btn ${speed === sp ? 'active' : ''}`}
                          onClick={() => setSpeed(sp)}
                        >
                          {sp.charAt(0).toUpperCase() + sp.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Motion Director Prompt */}
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 650, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Motion Direction
                  </label>
                  <input
                    className="vs-input"
                    placeholder={t.studio.howPicture}
                    value={motionPrompt}
                    onChange={(e) => setMotionPrompt(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* WORKFLOW 2: AI VIDEO AGENT */}
            {activeTab === 'ai-agent' && (
              <>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
                    AI Video Agent · Multi-Shot Storyboard Director
                  </h2>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Enter a one-line brief, product URL, or outline. The Agent plans every shot, script, and caption — then refine scenes by chatting.
                  </p>
                </div>

                <div className="vs-card" style={{ padding: 18, display: 'flex', gap: 10 }}>
                  <input
                    className="vs-input"
                    value={agentBrief}
                    onChange={(e) => setAgentBrief(e.target.value)}
                    placeholder="Paste a URL, product brief, or topic..."
                  />
                  <button
                    type="button"
                    className="vs-btn vs-btn-primary"
                    disabled={planningAgent}
                    onClick={handlePlanAgentStoryboard}
                  >
                    <Bot size={16} />
                    <span>{planningAgent ? 'Planning...' : 'Plan Multi-Shot'}</span>
                  </button>
                </div>

                {/* Editable Storyboard Shots */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {agentShots.map((shot, idx) => (
                    <div key={shot.id} className="vs-card" style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-brand)' }}>
                          SHOT 0{idx + 1} · {shot.title}
                        </span>
                        <span className="vs-tag">{shot.cameraMotion} · {shot.durationSec}s</span>
                      </div>
                      <textarea
                        className="vs-textarea"
                        style={{ minHeight: 62 }}
                        value={shot.script}
                        onChange={(e) => {
                          const next = [...agentShots];
                          next[idx] = { ...shot, script: e.target.value };
                          setAgentShots(next);
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Chat to Refine Scenes */}
                <div className="vs-card" style={{ padding: 16 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
                    Chat with Agent to Revise Shots
                  </div>
                  <div
                    style={{
                      maxHeight: 110,
                      overflowY: 'auto',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginBottom: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    {agentChatLog.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                  <form onSubmit={handleReviseAgentStoryboard} style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="vs-input"
                      placeholder='Try: "Make hooks punchier", "Add pricing shot", or "Translate to Tiếng Việt"'
                      value={agentChatInput}
                      onChange={(e) => setAgentChatInput(e.target.value)}
                    />
                    <button type="submit" className="vs-btn vs-btn-secondary">
                      <Send size={15} /> Revise
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* WORKFLOW 3: VIRAL AI MUSIC VIDEO */}
            {activeTab === 'viral-music' && (
              <>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
                    AI Music Video Generator · One Photo + One Song
                  </h2>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Upload MP3/WAV, paste a Suno or Udio track URL, and pair with any portrait for natural singing lip-sync.
                  </p>
                </div>

                <div className="vs-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="vs-grid-2">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 650, display: 'block', marginBottom: 6 }}>
                        Paste Suno / Udio Link or Song Title
                      </label>
                      <input
                        className="vs-input"
                        value={songLink}
                        onChange={(e) => setSongLink(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 650, display: 'block', marginBottom: 6 }}>
                        Backing Arrangement & Beat
                      </label>
                      <select
                        className="vs-select"
                        value={musicStyle}
                        onChange={(e) => setMusicStyle(e.target.value)}
                      >
                        <option>Synthwave Pop</option>
                        <option>Crimson R&B Studio</option>
                        <option>Acoustic Ballad</option>
                        <option>Festival EDM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 650, display: 'block', marginBottom: 6 }}>
                      Sung Chorus /Synced Lyrics
                    </label>
                    <textarea
                      className="vs-textarea"
                      style={{ minHeight: 74 }}
                      value={lyricsText}
                      onChange={(e) => setLyricsText(e.target.value)}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 650, marginBottom: 8 }}>
                      Select Singer Portrait (or Upload Your Own)
                    </div>
                    <div className="vs-avatar-grid">
                      {avatars.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setSelectedAvatarId(av.id)}
                          className={`vs-avatar-tile ${selectedAvatarId === av.id ? 'selected' : ''}`}
                        >
                          <img src={av.image} alt={av.name} />
                          <div className="vs-avatar-tile-label">{av.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* WORKFLOW 4: VIDEO & PHOTO FACE SWAP */}
            {activeTab === 'face-swap' && (
              <div className="vs-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>AI Video & Photo Face Swap</h2>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      Frame-by-frame motion, expression, and lighting alignment · Free HD · 0 Credits
                    </p>
                  </div>
                  <span className="vs-tag vs-tag-teal">FREE · 0 CREDITS</span>
                </div>

                <div className="vs-grid-2">
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 650, marginBottom: 8 }}>
                      1. Reference Face Identity ({activeAvatar?.name})
                    </div>
                    <div className="vs-avatar-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                      {avatars.slice(0, 6).map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setSelectedAvatarId(av.id)}
                          className={`vs-avatar-tile ${selectedAvatarId === av.id ? 'selected' : ''}`}
                        >
                          <img src={av.image} alt={av.name} />
                          <div className="vs-avatar-tile-label">{av.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 650, marginBottom: 8 }}>
                      2. Target Video Scene / Clip
                    </div>
                    <img
                      src={faceSwapTargetImg}
                      alt="Target scene"
                      style={{ width: '100%', height: 170, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <label className="vs-btn vs-btn-secondary vs-btn-sm" style={{ cursor: 'pointer' }}>
                        <Upload size={14} /> Upload Target Clip/Photo
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const r = new FileReader();
                            r.onload = () => {
                              if (typeof r.result === 'string') setFaceSwapTargetImg(r.result);
                            };
                            r.readAsDataURL(f);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="vs-btn vs-btn-secondary vs-btn-sm"
                        onClick={() =>
                          setFaceSwapTargetImg(
                            faceSwapTargetImg.includes('music')
                              ? '/assets/showcase/podcast-studio.jpg'
                              : '/assets/showcase/music-singer.jpg'
                          )
                        }
                      >
                        Switch Preset Clip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WORKFLOW 5: SEEDANCE 2.5 & VIDEO MODELS */}
            {activeTab === 'seedance' && (
              <div className="vs-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    Frontier AI Video Models Hub
                  </h2>
                  <select
                    className="vs-select"
                    style={{ width: 'auto' }}
                    value={selectedVideoModel}
                    onChange={(e) => setSelectedVideoModel(e.target.value)}
                  >
                    <option value="seedance-2.5">Seedance 2.5 (Multi-Ref 2K)</option>
                    <option value="kling-o3">Kling O3 (4K 60fps Omni)</option>
                    <option value="minimax-h3">MiniMax H3 (Native Stereo 2K)</option>
                    <option value="wan-3.0">Wan 3.0 (30s Single-Take)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Text To Video', 'Image To Video', '30-Second Clips', 'AI Video Ads', 'Redraw Editing'].map(
                    (m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSeedanceSubMode(m)}
                        className={seedanceSubMode === m ? 'vs-tag vs-tag-brand' : 'vs-tag'}
                        style={{ padding: '6px 12px', cursor: 'pointer' }}
                      >
                        {m}
                      </button>
                    )
                  )}
                </div>

                <textarea
                  className="vs-textarea"
                  value={seedancePrompt}
                  onChange={(e) => setSeedancePrompt(e.target.value)}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Clip Duration:</span>
                  {[5, 8, 15, 30].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setSeedanceDuration(sec)}
                      className={seedanceDuration === sec ? 'vs-btn vs-btn-primary vs-btn-sm' : 'vs-btn vs-btn-secondary vs-btn-sm'}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WORKFLOW 6: VIDEO PODCAST (DUAL HOST) */}
            {activeTab === 'podcast' && (
              <div className="vs-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    AI Video Podcast · Auto Two-Host Split Studio
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Assign two AI hosts or upload a Google NotebookLM podcast MP3 to render an ON-AIR broadcast episode.
                  </p>
                </div>

                <div className="vs-grid-2">
                  <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-teal)', marginBottom: 8 }}>
                      HOST 01 (LEFT MIC)
                    </div>
                    <select
                      className="vs-select"
                      style={{ marginBottom: 8 }}
                      value={selectedAvatarId}
                      onChange={(e) => setSelectedAvatarId(e.target.value)}
                    >
                      {avatars.map((a) => (
                        <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                      ))}
                    </select>
                    <select
                      className="vs-select"
                      value={selectedVoiceId}
                      onChange={(e) => setSelectedVoiceId(e.target.value)}
                    >
                      {voices.map((v) => (
                        <option key={v.id} value={v.id}>{v.name} · {v.language}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-brand)', marginBottom: 8 }}>
                      HOST 02 (RIGHT MIC)
                    </div>
                    <select
                      className="vs-select"
                      style={{ marginBottom: 8 }}
                      value={secondaryAvatarId}
                      onChange={(e) => setSecondaryAvatarId(e.target.value)}
                    >
                      {avatars.map((a) => (
                        <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                      ))}
                    </select>
                    <select
                      className="vs-select"
                      value={secondaryVoiceId}
                      onChange={(e) => setSecondaryVoiceId(e.target.value)}
                    >
                      {voices.map((v) => (
                        <option key={v.id} value={v.id}>{v.name} · {v.language}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {podcastLines.map((line, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        type="button"
                        className={line.host === 'A' ? 'vs-tag vs-tag-teal' : 'vs-tag vs-tag-brand'}
                        onClick={() => {
                          const next = [...podcastLines];
                          next[idx] = { ...line, host: line.host === 'A' ? 'B' : 'A' };
                          setPodcastLines(next);
                        }}
                      >
                        Host {line.host}
                      </button>
                      <input
                        className="vs-input"
                        value={line.text}
                        onChange={(e) => {
                          const next = [...podcastLines];
                          next[idx] = { ...line, text: e.target.value };
                          setPodcastLines(next);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="vs-btn vs-btn-secondary vs-btn-sm"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() =>
                      setPodcastLines((prev) => [
                        ...prev,
                        { host: prev.length % 2 === 0 ? 'A' : 'B', text: 'Let us show an example clip right now!' },
                      ])
                    }
                  >
                    <Plus size={14} /> Add Dialogue Turn
                  </button>
                </div>
              </div>
            )}

            {/* WORKFLOW 7: AI PRESENTATION (SLIDES TO VIDEO) */}
            {activeTab === 'presentation' && (
              <div className="vs-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      AI Presentation Maker · Slides to Presenter Video
                    </h2>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      Edit slide deck headlines, bullet points, and presenter narration — rendered with Picture-in-Picture avatar.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="vs-btn vs-btn-secondary vs-btn-sm"
                    onClick={() =>
                      setSlides((prev) => [
                        ...prev,
                        {
                          id: `slide_${Date.now()}`,
                          shotNumber: prev.length + 1,
                          title: `Key Takeaway 0${prev.length + 1}`,
                          visualPrompt: 'Consistent avatar delivery across 88 languages with zero studio reshoots.',
                          script: 'Finally, teams can update any slide in seconds without re-recording.',
                          cameraMotion: `Slide 0${prev.length + 1}`,
                          durationSec: 5,
                        },
                      ])
                    }
                  >
                    <Plus size={14} /> Add Slide
                  </button>
                </div>

                {slides.map((sl, idx) => (
                  <div
                    key={sl.id}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-brand)' }}>
                      SLIDE 0{idx + 1}
                    </div>
                    <input
                      className="vs-input"
                      value={sl.title}
                      onChange={(e) => {
                        const next = [...slides];
                        next[idx] = { ...sl, title: e.target.value };
                        setSlides(next);
                      }}
                      placeholder="Slide Headline"
                    />
                    <input
                      className="vs-input"
                      value={sl.visualPrompt}
                      onChange={(e) => {
                        const next = [...slides];
                        next[idx] = { ...sl, visualPrompt: e.target.value };
                        setSlides(next);
                      }}
                      placeholder="Slide Bullet Summary"
                    />
                    <input
                      className="vs-input"
                      value={sl.script}
                      onChange={(e) => {
                        const next = [...slides];
                        next[idx] = { ...sl, script: e.target.value };
                        setSlides(next);
                      }}
                      placeholder="Presenter Spoken Voiceover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* SHARED BOTTOM OUTPUT BAR (Aspect Ratio, Resolution, Green Screen, Credit Bill, Generate) */}
            <div
              className="vs-card"
              style={{
                padding: 18,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 14,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                <div className="vs-segmented">
                  {(['9:16', '1:1', '16:9'] as AspectRatioOption[]).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      className={`vs-segmented-btn ${aspectRatio === ar ? 'active' : ''}`}
                      onClick={() => setAspectRatio(ar)}
                    >
                      {ar}
                    </button>
                  ))}
                </div>

                <div className="vs-segmented">
                  {(['720p', '1080p', '2K'] as ResolutionOption[]).map((res) => (
                    <button
                      key={res}
                      type="button"
                      className={`vs-segmented-btn ${resolution === res ? 'active' : ''}`}
                      onClick={() => setResolution(res)}
                    >
                      {res}
                    </button>
                  ))}
                </div>

                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.83rem',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: greenScreen ? 'var(--accent-teal-soft)' : 'var(--bg-elevated)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={greenScreen}
                    onChange={(e) => setGreenScreen(e.target.checked)}
                  />
                  <Layers size={14} />
                  <span>{t.studio.greenScreen}</span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Credits Bills Breakdown Popover Trigger */}
                <button
                  type="button"
                  className="vs-btn vs-btn-secondary vs-btn-sm"
                  onClick={() => setShowBillPopover((v) => !v)}
                  id="studio-credits-bill-btn"
                >
                  <Coins size={14} style={{ color: 'var(--accent-amber)' }} />
                  <span>
                    {t.studio.creditsBills}: <strong>{creditBill.totalCredits}</strong>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateVideo}
                  disabled={isRendering}
                  className="vs-btn vs-btn-primary"
                  id="studio-generate-btn"
                >
                  <Sparkles size={16} />
                  <span>
                    {isRendering ? `${t.studio.generating} ${renderProgress}%` : t.studio.generate}
                  </span>
                </button>
              </div>

              {/* Popover matching app.visionstory.ai Credits Bills */}
              {showBillPopover && (
                <div
                  className="vs-card"
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 10px)',
                    right: 18,
                    width: 320,
                    padding: 16,
                    zIndex: 50,
                    background: 'hsl(222, 20%, 9%)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 10 }}>
                    Credits Bill Breakdown
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Estimated Video Duration</span>
                      <strong>{creditBill.estimatedDurationSec}s</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>4s Intervals</span>
                      <strong>×{creditBill.intervals}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Base Credits (720p)</span>
                      <strong>{creditBill.baseCredits}</strong>
                    </div>
                    {creditBill.resolutionAddonCredits > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Resolution Add-on ({resolution})</span>
                        <strong>+{creditBill.resolutionAddonCredits}</strong>
                      </div>
                    )}
                    {creditBill.greenScreenAddonCredits > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Green Screen (+0.25×)</span>
                        <strong>+{creditBill.greenScreenAddonCredits}</strong>
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: 8,
                        marginTop: 4,
                        borderTop: '1px solid var(--border-hairline)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                      }}
                    >
                      <span>Total Credits (Rounded Up)</span>
                      <strong style={{ color: 'var(--accent-brand)' }}>{creditBill.totalCredits} cr</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* RIGHT PANEL: LIVE PLAYER & CREATIONS FEED */}
      <aside className="vs-studio-right">
        <div style={{ fontWeight: 700, fontSize: '0.96rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{t.studio.creations}</span>
          <span className="vs-tag">{projects.length}</span>
        </div>

        {/* Active Video Player Card */}
        {activeProject && (
          <div className="vs-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                background: '#080b11',
                position: 'relative',
                aspectRatio:
                  activeProject.aspectRatio === '9:16'
                    ? '9 / 14'
                    : activeProject.aspectRatio === '1:1'
                    ? '1 / 1'
                    : '16 / 9',
                maxHeight: 330,
              }}
            >
              {renderedVideoUrls[activeProject.id] ? (
                <video
                  key={renderedVideoUrls[activeProject.id]}
                  src={renderedVideoUrls[activeProject.id]}
                  controls
                  autoPlay
                  loop
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img
                    src={activeProject.avatarImage}
                    alt={activeProject.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(6, 9, 15, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleRenderExistingProject(activeProject)}
                      className="vs-btn vs-btn-primary vs-btn-sm"
                    >
                      <Play size={14} /> Render & Play Preview
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontWeight: 650, fontSize: '0.86rem', lineHeight: 1.35 }}>
              {activeProject.title}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="vs-tag">{activeProject.resolution}</span>
              <span className="vs-tag">{activeProject.aspectRatio}</span>
              <span className="vs-tag">00:{String(activeProject.durationSec).padStart(2, '0')}</span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="vs-btn vs-btn-secondary vs-btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  const v = voices.find((vo) => vo.id === activeProject.voiceId) || voices[0];
                  speakScript({ text: activeProject.script, voice: v, speed: activeProject.speed });
                }}
              >
                <Volume2 size={14} /> {t.studio.playWithVoice}
              </button>

              {renderedVideoUrls[activeProject.id] && (
                <a
                  href={renderedVideoUrls[activeProject.id]}
                  download={`${activeProject.id}-${activeProject.resolution}.webm`}
                  className="vs-btn vs-btn-primary vs-btn-sm"
                >
                  <Download size={14} /> .webm
                </a>
              )}
            </div>
          </div>
        )}

        {/* History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setActiveProject(proj)}
              className="vs-card vs-card-interactive"
              style={{
                padding: 10,
                display: 'flex',
                gap: 10,
                cursor: 'pointer',
                borderColor: activeProject?.id === proj.id ? 'var(--accent-brand)' : undefined,
              }}
            >
              <img
                src={proj.avatarImage}
                alt={proj.title}
                style={{ width: 58, height: 58, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 650,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {proj.title}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  00:{String(proj.durationSec).padStart(2, '0')} · {proj.resolution} · {proj.workflow}
                </div>
              </div>
              <button
                type="button"
                className="vs-btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(proj.id);
                }}
                title="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
