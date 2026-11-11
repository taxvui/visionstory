'use client';

import { VoiceOption } from './catalog';

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  activeUtterance = null;
}

export function speakScript(params: {
  text: string;
  voice?: VoiceOption;
  speed?: 'slow' | 'normal' | 'fast';
  onBoundary?: (charIndex: number) => void;
  onEnd?: () => void;
}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    params.onEnd?.();
    return;
  }

  stopSpeaking();
  const text = params.text.trim();
  if (!text) {
    params.onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const langCode = params.voice?.languageCode || 'en-US';
  utterance.lang = langCode;

  const speedMultiplier =
    params.speed === 'slow' ? 0.84 : params.speed === 'fast' ? 1.18 : 1.0;
  utterance.rate = (params.voice?.rate ?? 1.0) * speedMultiplier;
  utterance.pitch = params.voice?.pitch ?? 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const exactLang = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase())
    );
    if (exactLang.length > 0) {
      const wantFemale = params.voice?.gender === 'Female';
      const genderMatched = exactLang.find((v) =>
        wantFemale
          ? /female|samantha|victoria|google|zira|linh|anh|nova/i.test(v.name)
          : /male|daniel|david|alex|google|nam|huy/i.test(v.name)
      );
      utterance.voice = genderMatched || exactLang[0];
    }
  }

  utterance.onboundary = (ev) => {
    params.onBoundary?.(ev.charIndex);
  };
  utterance.onend = () => {
    activeUtterance = null;
    params.onEnd?.();
  };
  utterance.onerror = () => {
    activeUtterance = null;
    params.onEnd?.();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Creates a procedural Web Audio backing track routed to a MediaStreamDestination
 * so MediaRecorder embeds real stereo audio in generated WebM videos.
 */
export function createProceduralAudioTrack(
  style: 'ambient' | 'synthwave' | 'acoustic' | 'podcast' | 'cinema' = 'ambient'
): {
  stream: MediaStream;
  stop: () => void;
} | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const dest = ctx.createMediaStreamDestination();
  const master = ctx.createGain();
  master.gain.value = style === 'synthwave' ? 0.16 : 0.09;
  master.connect(dest);

  const chordFreqs =
    style === 'synthwave'
      ? [220, 277.18, 329.63, 440]
      : style === 'cinema'
      ? [130.81, 196.0, 261.63, 311.13]
      : style === 'podcast'
      ? [196.0, 246.94, 293.66, 392.0]
      : [261.63, 329.63, 392.0, 493.88];

  const oscs: OscillatorNode[] = [];
  chordFreqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = style === 'synthwave' ? 'sawtooth' : 'sine';
    osc.frequency.value = freq;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = style === 'synthwave' ? 950 : 620;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.6 + idx * 0.25;
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain);
    lfoGain.connect(oscGain.gain);

    oscGain.gain.value = 0.06;
    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(master);

    osc.start();
    lfo.start();
    oscs.push(osc, lfo);
  });

  // Gentle rhythmic pulse for music / cinema modes
  let pulseTimer: number | null = null;
  if (style === 'synthwave' || style === 'cinema' || style === 'acoustic') {
    const bpmMs = style === 'synthwave' ? 480 : 650;
    pulseTimer = window.setInterval(() => {
      if (ctx.state === 'closed') return;
      const kick = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kick.type = 'triangle';
      kick.frequency.setValueAtTime(125, ctx.currentTime);
      kick.frequency.exponentialRampToValueAtTime(46, ctx.currentTime + 0.16);
      kickGain.gain.setValueAtTime(0.18, ctx.currentTime);
      kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      kick.connect(kickGain);
      kickGain.connect(master);
      kick.start();
      kick.stop(ctx.currentTime + 0.19);
    }, bpmMs);
  }

  return {
    stream: dest.stream,
    stop: () => {
      if (pulseTimer !== null) window.clearInterval(pulseTimer);
      oscs.forEach((o) => {
        try {
          o.stop();
        } catch {
          // ignore
        }
      });
      ctx.close().catch(() => {});
    },
  };
}

/**
 * Processes an uploaded or recorded audio File/Blob through Web Audio API
 * for Noise Removal (highpass + compressor) and Voice Changer (playbackRate/pitch)
 * and encodes a downloadable WAV Blob URL.
 */
export async function processAudioEnhancement(params: {
  file: Blob;
  removeNoise: boolean;
  pitchShift: 'normal' | 'bright' | 'deep' | 'broadcast';
}): Promise<string> {
  const arrayBuf = await params.file.arrayBuffer();
  const tempCtx = new AudioContext();
  const decoded = await tempCtx.decodeAudioData(arrayBuf);
  await tempCtx.close();

  const rateFactor =
    params.pitchShift === 'bright'
      ? 1.14
      : params.pitchShift === 'deep'
      ? 0.86
      : params.pitchShift === 'broadcast'
      ? 0.96
      : 1.0;

  const outLength = Math.max(1, Math.floor(decoded.length / rateFactor));
  const offline = new OfflineAudioContext(
    decoded.numberOfChannels,
    outLength,
    decoded.sampleRate
  );

  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.playbackRate.value = rateFactor;

  let lastNode: AudioNode = source;

  if (params.removeNoise) {
    const highpass = offline.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 115;

    const lowpass = offline.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 7800;

    const compressor = offline.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 18;
    compressor.ratio.value = 4;

    lastNode.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(compressor);
    lastNode = compressor;
  }

  if (params.pitchShift === 'broadcast') {
    const presence = offline.createBiquadFilter();
    presence.type = 'peaking';
    presence.frequency.value = 3200;
    presence.gain.value = 4.5;
    lastNode.connect(presence);
    lastNode = presence;
  }

  lastNode.connect(offline.destination);
  source.start(0);
  const rendered = await offline.startRendering();
  const wavBlob = audioBufferToWav(rendered);
  return URL.createObjectURL(wavBlob);
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const samples = buffer.length;
  const dataSize = samples * blockAlign;
  const out = new ArrayBuffer(44 + dataSize);
  const view = new DataView(out);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  const channelData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < samples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channelData[c][i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }
  }

  return new Blob([out], { type: 'audio/wav' });
}
