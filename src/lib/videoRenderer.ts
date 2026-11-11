'use client';

import { AspectRatioOption, ResolutionOption, StudioWorkflowType } from './credits';
import { StoryboardShot } from './db';
import { createProceduralAudioTrack } from './audioEngine';

export interface RenderVideoOptions {
  workflow: StudioWorkflowType;
  title: string;
  script: string;
  avatarImage: string;
  secondaryAvatarImage?: string;
  aspectRatio: AspectRatioOption;
  resolution: ResolutionOption;
  greenScreen?: boolean;
  cinematic?: boolean;
  durationSec: number;
  shots?: StoryboardShot[];
  musicStyle?: string;
  stageTheme?: string;
  watermark?: boolean;
  onProgress?: (percent: number) => void;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function getCanvasDimensions(aspectRatio: AspectRatioOption, resolution: ResolutionOption): {
  width: number;
  height: number;
} {
  const baseShort = resolution === '2K' ? 1080 : resolution === '1080p' ? 900 : 720;
  if (aspectRatio === '9:16') {
    return { width: baseShort, height: Math.round((baseShort * 16) / 9) };
  }
  if (aspectRatio === '1:1') {
    return { width: baseShort, height: baseShort };
  }
  return { width: Math.round((baseShort * 16) / 9), height: baseShort };
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  scale = 1,
  offsetX = 0,
  offsetY = 0
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let drawW = w;
  let drawH = h;
  if (imgRatio > boxRatio) {
    drawH = h * scale;
    drawW = drawH * imgRatio;
  } else {
    drawW = w * scale;
    drawH = drawW / imgRatio;
  }
  const drawX = x + (w - drawW) / 2 + offsetX;
  const drawY = y + (h - drawH) / 2 + offsetY;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Renders an animated, caption-synced VisionStory video on an offscreen HTML5 Canvas
 * and captures a real downloadable WebM video Blob URL with stereo audio.
 */
export async function renderStudioVideo(options: RenderVideoOptions): Promise<{
  videoUrl: string;
  durationSec: number;
}> {
  const { width, height } = getCanvasDimensions(options.aspectRatio, options.resolution);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const primaryImg = await loadImage(options.avatarImage).catch(() => null);
  const secondaryImg = options.secondaryAvatarImage
    ? await loadImage(options.secondaryAvatarImage).catch(() => null)
    : null;

  // Keep actual realtime render crisp & fast (4.5s - 7.5s capture) while encoding all scenes smoothly
  const renderDurationMs = Math.min(7500, Math.max(4200, options.durationSec * 520));
  const fps = 30;

  const audioStyle =
    options.workflow === 'viral-music'
      ? 'synthwave'
      : options.workflow === 'podcast'
      ? 'podcast'
      : options.workflow === 'seedance' || options.cinematic
      ? 'cinema'
      : 'ambient';

  const audioTrack = createProceduralAudioTrack(audioStyle);
  const canvasStream = canvas.captureStream(fps);
  if (audioTrack) {
    audioTrack.stream.getAudioTracks().forEach((t) => canvasStream.addTrack(t));
  }

  const mimeCandidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  const supportedMime =
    mimeCandidates.find((m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) ||
    '';

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(
    canvasStream,
    supportedMime ? { mimeType: supportedMime, videoBitsPerSecond: 4_200_000 } : undefined
  );

  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };

  const words = options.script.trim().split(/\s+/).filter(Boolean);
  const shots = options.shots && options.shots.length > 0 ? options.shots : null;

  return new Promise((resolve) => {
    recorder.onstop = () => {
      audioTrack?.stop();
      const blob = new Blob(chunks, { type: supportedMime || 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      options.onProgress?.(100);
      resolve({ videoUrl, durationSec: options.durationSec });
    };

    recorder.start(150);
    const startTime = performance.now();

    const drawFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / renderDurationMs);
      const tSec = elapsed / 1000;
      options.onProgress?.(Math.min(99, Math.round(progress * 100)));

      // Clear background
      if (options.greenScreen) {
        ctx.fillStyle = '#00d448';
        ctx.fillRect(0, 0, width, height);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        if (options.workflow === 'viral-music') {
          bgGrad.addColorStop(0, '#1d0a12');
          bgGrad.addColorStop(0.5, '#2b121c');
          bgGrad.addColorStop(1, '#0b0e16');
        } else if (options.workflow === 'presentation') {
          bgGrad.addColorStop(0, '#0f1724');
          bgGrad.addColorStop(1, '#162133');
        } else {
          bgGrad.addColorStop(0, '#0c0f16');
          bgGrad.addColorStop(1, '#171d2b');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Dynamic vocal syllable energy simulation for realistic talking cadence
      const speechEnergy =
        0.5 +
        0.35 * Math.sin(tSec * 13.5) +
        0.15 * Math.cos(tSec * 23.0);

      if (options.workflow === 'podcast') {
        // Dual-host studio broadcast layout
        const activeHost = Math.floor(tSec / 1.8) % 2; // alternates Host A & Host B
        const pad = Math.round(width * 0.04);
        const isVertical = height > width;
        const cardW = isVertical ? width - pad * 2 : Math.round((width - pad * 3) / 2);
        const cardH = isVertical ? Math.round((height - pad * 4) * 0.4) : Math.round(height * 0.66);

        const posA = { x: pad, y: isVertical ? pad * 2 : Math.round(height * 0.13) };
        const posB = isVertical
          ? { x: pad, y: posA.y + cardH + pad }
          : { x: pad * 2 + cardW, y: Math.round(height * 0.13) };

        [
          { img: primaryImg, pos: posA, active: activeHost === 0, label: 'HOST 01 · ARIA' },
          { img: secondaryImg || primaryImg, pos: posB, active: activeHost === 1, label: 'HOST 02 · MARCUS' },
        ].forEach((host) => {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(host.pos.x, host.pos.y, cardW, cardH, 20);
          ctx.clip();
          if (host.img) {
            const zoom = host.active ? 1.04 + 0.012 * Math.sin(tSec * 5) : 1.01;
            drawCoverImage(ctx, host.img, host.pos.x, host.pos.y, cardW, cardH, zoom, 0, host.active ? Math.sin(tSec * 7) * 3 : 0);
          }
          ctx.restore();

          // Speaking indicator frame
          ctx.strokeStyle = host.active ? '#19b394' : 'rgba(255,255,255,0.14)';
          ctx.lineWidth = host.active ? 4 : 1.5;
          ctx.beginPath();
          ctx.roundRect(host.pos.x, host.pos.y, cardW, cardH, 20);
          ctx.stroke();

          // Speaker badge + live audio bars
          ctx.fillStyle = 'rgba(10, 14, 22, 0.78)';
          ctx.beginPath();
          ctx.roundRect(host.pos.x + 16, host.pos.y + cardH - 48, 195, 34, 10);
          ctx.fill();
          ctx.fillStyle = '#f8fafc';
          ctx.font = `600 ${Math.max(13, Math.round(width * 0.015))}px system-ui, sans-serif`;
          ctx.fillText(host.label, host.pos.x + 28, host.pos.y + cardH - 26);

          if (host.active) {
            for (let b = 0; b < 5; b++) {
              const barH = 6 + 16 * Math.abs(Math.sin(tSec * 12 + b * 1.1));
              ctx.fillStyle = '#19b394';
              ctx.fillRect(
                host.pos.x + 178 + b * 6,
                host.pos.y + cardH - 22 - barH,
                4,
                barH
              );
            }
          }
        });

        // ON AIR Broadcast header
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(pad, 18, 92, 28, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 13px system-ui, sans-serif';
        ctx.fillText('● ON AIR', pad + 14, 37);
      } else if (options.workflow === 'presentation') {
        // Slide presentation canvas + circular talking avatar presenter PiP
        const activeSlideIdx = shots
          ? Math.min(shots.length - 1, Math.floor(progress * shots.length))
          : 0;
        const activeSlide = shots ? shots[activeSlideIdx] : null;

        const pad = Math.round(width * 0.06);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(pad, pad, width - pad * 2, height - pad * 2, 24);
        ctx.fill();
        ctx.stroke();

        // Accent bar
        ctx.fillStyle = '#f26430';
        ctx.fillRect(pad + 36, pad + 42, 56, 5);

        ctx.fillStyle = '#94a3b8';
        ctx.font = `600 ${Math.round(height * 0.022)}px system-ui, sans-serif`;
        ctx.fillText(
          `SLIDE 0${activeSlideIdx + 1} / 0${shots ? shots.length : 1}  ·  VISIONSTORY AI DECK`,
          pad + 36,
          pad + 78
        );

        ctx.fillStyle = '#f8fafc';
        ctx.font = `700 ${Math.round(height * 0.05)}px system-ui, sans-serif`;
        const slideTitle = activeSlide?.title || options.title;
        const titleLines = wrapTextLines(ctx, slideTitle, width - pad * 3.5);
        titleLines.slice(0, 2).forEach((line, idx) => {
          ctx.fillText(line, pad + 36, pad + 135 + idx * Math.round(height * 0.06));
        });

        ctx.fillStyle = '#cbd5e1';
        ctx.font = `400 ${Math.round(height * 0.028)}px system-ui, sans-serif`;
        const bodyText = activeSlide?.visualPrompt || options.script;
        const bulletLines = wrapTextLines(ctx, bodyText, width * 0.56);
        bulletLines.slice(0, 4).forEach((line, idx) => {
          ctx.fillText(`•  ${line}`, pad + 36, pad + 230 + idx * Math.round(height * 0.046));
        });

        // Circular Presenter PiP in bottom-right
        const pipRadius = Math.round(Math.min(width, height) * 0.14);
        const pipCx = width - pad - pipRadius - 24;
        const pipCy = height - pad - pipRadius - 36;
        if (primaryImg) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(pipCx, pipCy, pipRadius, 0, Math.PI * 2);
          ctx.clip();
          const nod = Math.sin(tSec * 6.5) * 3;
          drawCoverImage(
            ctx,
            primaryImg,
            pipCx - pipRadius,
            pipCy - pipRadius,
            pipRadius * 2,
            pipRadius * 2,
            1.06 + speechEnergy * 0.015,
            0,
            nod
          );
          ctx.restore();

          ctx.strokeStyle = '#f26430';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(pipCx, pipCy, pipRadius + 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        // Full-bleed Talking Avatar / AI Agent / Viral Music / Seedance / Face Swap
        if (primaryImg) {
          const breatheScale = options.greenScreen
            ? 0.92 + 0.008 * Math.sin(tSec * 4)
            : 1.03 + 0.045 * progress + 0.008 * Math.sin(tSec * 5.2);
          const swayX = options.cinematic || options.workflow === 'viral-music'
            ? Math.sin(tSec * 2.2) * 14
            : Math.sin(tSec * 1.6) * 4;
          const nodY = Math.sin(tSec * 6.8) * (2.5 + speechEnergy * 2.5);

          if (options.greenScreen) {
            // Circular/rounded upper-body cutout silhouette on chroma green
            const boxW = Math.round(width * 0.76);
            const boxH = Math.round(height * 0.78);
            const boxX = Math.round((width - boxW) / 2);
            const boxY = Math.round(height * 0.12);
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxW, boxH, Math.round(boxW * 0.42));
            ctx.clip();
            drawCoverImage(ctx, primaryImg, boxX, boxY, boxW, boxH, 1.05, swayX * 0.4, nodY);
            ctx.restore();
          } else {
            drawCoverImage(ctx, primaryImg, 0, 0, width, height, breatheScale, swayX, nodY);
          }
        }

        // Face Swap subtle tracking overlay if face-swap mode
        if (options.workflow === 'face-swap' && secondaryImg) {
          const badgeSize = Math.round(Math.min(width, height) * 0.16);
          ctx.save();
          ctx.beginPath();
          ctx.arc(width - badgeSize * 0.8, badgeSize * 0.85, badgeSize * 0.45, 0, Math.PI * 2);
          ctx.clip();
          drawCoverImage(
            ctx,
            secondaryImg,
            width - badgeSize * 1.25,
            badgeSize * 0.4,
            badgeSize * 0.9,
            badgeSize * 0.9,
            1.05
          );
          ctx.restore();
          ctx.strokeStyle = '#19b394';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(width - badgeSize * 0.8, badgeSize * 0.85, badgeSize * 0.45, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Viral Music equalizer & stage spotlight glow
        if (options.workflow === 'viral-music' && !options.greenScreen) {
          const pulse = 0.16 + 0.12 * Math.sin(tSec * 8);
          const stageGrad = ctx.createRadialGradient(
            width * 0.5,
            height * 0.25,
            20,
            width * 0.5,
            height * 0.5,
            width * 0.8
          );
          stageGrad.addColorStop(0, `rgba(242, 100, 48, ${pulse})`);
          stageGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
          ctx.fillStyle = stageGrad;
          ctx.fillRect(0, 0, width, height);

          const bars = 28;
          const totalBarW = width * 0.54;
          const startX = (width - totalBarW) / 2;
          const step = totalBarW / bars;
          for (let i = 0; i < bars; i++) {
            const amp =
              10 +
              36 *
                Math.abs(Math.sin(tSec * 9.5 + i * 0.45)) *
                (0.5 + 0.5 * Math.cos(i * 0.2));
            ctx.fillStyle = i % 2 === 0 ? '#f26430' : '#f59e0b';
            ctx.fillRect(startX + i * step, height - 42 - amp, step * 0.62, amp);
          }
        }

        // Multi-shot AI Agent scene header
        if (options.workflow === 'ai-agent' && shots && shots.length > 0) {
          const shotIdx = Math.min(shots.length - 1, Math.floor(progress * shots.length));
          const shot = shots[shotIdx];
          ctx.fillStyle = 'rgba(12, 15, 22, 0.76)';
          ctx.beginPath();
          ctx.roundRect(24, 24, Math.min(width - 48, 360), 42, 12);
          ctx.fill();
          ctx.fillStyle = '#f26430';
          ctx.font = '700 13px system-ui, sans-serif';
          ctx.fillText(`SHOT 0${shot.shotNumber} · ${shot.title.toUpperCase()}`, 40, 50);
        }
      }

      // Lower vignette & synchronized dynamic captions
      if (!options.greenScreen) {
        const bottomGrad = ctx.createLinearGradient(0, height * 0.62, 0, height);
        bottomGrad.addColorStop(0, 'rgba(8, 10, 16, 0)');
        bottomGrad.addColorStop(1, 'rgba(8, 10, 16, 0.86)');
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, height * 0.62, width, height * 0.38);
      }

      if (words.length > 0) {
        const currentWordIndex = Math.min(words.length - 1, Math.floor(progress * words.length));
        const chunkSize = width < height ? 5 : 8;
        const chunkStart = Math.floor(currentWordIndex / chunkSize) * chunkSize;
        const captionWords = words.slice(chunkStart, chunkStart + chunkSize);
        const captionLine = captionWords.join(' ');

        const fontSize = Math.max(18, Math.round(Math.min(width, height) * 0.042));
        ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';

        const textW = ctx.measureText(captionLine).width;
        const pillW = Math.min(width * 0.9, textW + 44);
        const pillH = fontSize + 26;
        const pillX = (width - pillW) / 2;
        const pillY = height - pillH - (options.workflow === 'viral-music' ? 92 : 52);

        ctx.fillStyle = 'rgba(12, 15, 22, 0.82)';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 14);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(captionLine, width / 2, pillY + fontSize + 6, width * 0.86);
        ctx.textAlign = 'left';
      }

      // Live voice waveform pill in top-right (shows lifelike vocal sync)
      const waveX = width - 134;
      const waveY = 24;
      ctx.fillStyle = 'rgba(12, 15, 22, 0.72)';
      ctx.beginPath();
      ctx.roundRect(waveX, waveY, 110, 34, 10);
      ctx.fill();
      for (let i = 0; i < 9; i++) {
        const hBar = 5 + 16 * Math.abs(Math.sin(tSec * 14 + i * 0.7)) * speechEnergy;
        ctx.fillStyle = '#625df5';
        ctx.fillRect(waveX + 14 + i * 9.5, waveY + 17 - hBar / 2, 5, hBar);
      }

      // Free tier subtle watermark unless Pro/Advanced/Ultra or Face Swap
      if (options.watermark && options.workflow !== 'face-swap') {
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = '600 13px system-ui, sans-serif';
        ctx.fillText('VisionStory AI · 720p Preview', 24, height - 18);
      }

      if (elapsed < renderDurationMs) {
        requestAnimationFrame(drawFrame);
      } else {
        recorder.stop();
      }
    };

    requestAnimationFrame(drawFrame);
  });
}
