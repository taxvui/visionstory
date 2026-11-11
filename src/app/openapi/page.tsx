'use client';

import React, { useState } from 'react';
import { Copy, KeyRound, Play, Plus, Terminal, Trash2 } from 'lucide-react';
import { AI_MODELS } from '@/lib/catalog';
import { useVisionStory } from '@/components/VisionStoryProvider';
import { Footer } from '@/components/Footer';

const PYTHON_SDK_SNIPPET = `from pathlib import Path
from visionstory import VisionStoryClient, build_video_payload

client = VisionStoryClient.from_env()  # Reads VISIONSTORY_API_KEY
payload = build_video_payload(
    avatar_id="av_aria_v4",
    text_script="Hello from our automated VisionStory pipeline!",
    voice_id="voice_alloy",
    resolution="1080p",
)
video = client.generate_video(payload)
print(video["video_id"], video["status"])`;

const CURL_SNIPPET = `curl -X POST http://localhost:3000/api/v1/video \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: vs_live_demo9f84a2c71e6b30d54c8a1f2e" \\
  -d '{
    "avatar_id": "av_aria_v4",
    "text_script": "Welcome to the VisionStory REST API!",
    "voice_id": "voice_alloy",
    "resolution": "720p",
    "aspect_ratio": "16:9"
  }'`;

export default function OpenApiPage() {
  const { apiKeys, refreshState, showToast } = useVisionStory();
  const [snippetTab, setSnippetTab] = useState<'python' | 'curl'>('python');
  const [newKeyName, setNewKeyName] = useState('Production Backend Key');
  const [freshRawKey, setFreshRawKey] = useState<string | null>(null);

  // Live REST API Playground State
  const [endpoint, setEndpoint] = useState<
    'GET /api/v1/credits' | 'GET /api/v1/models' | 'GET /api/v1/avatars' | 'GET /api/v1/voices' | 'POST /api/v1/video'
  >('POST /api/v1/video');
  const [playgroundScript, setPlaygroundScript] = useState(
    'Shipping localized talking-avatar product demos directly from our CI pipeline!'
  );
  const [playgroundResponse, setPlaygroundResponse] = useState<string>(
    '// Click "Send Authenticated Request" to execute against the live Next.js API'
  );
  const [runningReq, setRunningReq] = useState(false);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_api_key', name: newKeyName }),
    });
    if (res.ok) {
      const data = await res.json();
      setFreshRawKey(data.rawKey);
      await refreshState();
      showToast('Created new VisionStory API key! Copy it now.');
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'revoke_api_key', keyId }),
    });
    await refreshState();
    showToast('Revoked API key.');
  };

  const runLiveRequest = async () => {
    setRunningReq(true);
    try {
      const [method, path] = endpoint.split(' ');
      const res = await fetch(path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(freshRawKey ? { 'X-API-Key': freshRawKey } : {}),
        },
        body:
          method === 'POST'
            ? JSON.stringify({
                avatar_id: 'av_aria_v4',
                text_script: playgroundScript,
                voice_id: 'voice_alloy',
                resolution: '720p',
                aspect_ratio: '16:9',
              })
            : undefined,
      });
      const json = await res.json();
      setPlaygroundResponse(JSON.stringify(json, null, 2));
      await refreshState();
    } finally {
      setRunningReq(false);
    }
  };

  return (
    <main>
      <section className="vs-section" style={{ paddingTop: 64 }}>
        <div className="vs-container">
          <div style={{ maxWidth: 800, marginBottom: 48 }}>
            <span className="vs-eyebrow">POST /api/v1/video · REST · Python SDK · CLI · MCP</span>
            <h1 className="vs-h1" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)', marginBottom: 16 }}>
              VisionStory API built for developers
            </h1>
            <p className="vs-lead">
              Build lip-synced talking-avatar videos from text or audio with the VisionStory REST API, Python SDK, CLI, or MCP server. Discover live models, avatars, and voices, submit jobs, and automate media pipelines.
            </p>
          </div>

          {/* 4 INTEGRATION INTERFACES */}
          <div className="vs-grid-4" style={{ marginBottom: 56 }}>
            {[
              ['01 REST', 'Call the REST API', 'List models, avatars, and voices; send text_script or audio_script to POST /api/v1/video.'],
              ['02 PYTHON', 'Python SDK', 'Typed zero-dependency client for environment auth, payload construction, and job polling.'],
              ['03 CLI', 'VisionStory CLI', 'Run visionstory doctor, verify credits, discover resource IDs, and render from terminal or CI.'],
              ['04 MCP / SKILL', 'Coding Agents', 'Connect Claude Code, Cursor, Codex, Windsurf, Cline, and Gemini with secret key isolation.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="vs-card" style={{ padding: 22 }}>
                <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--accent-brand)', fontWeight: 700, marginBottom: 8 }}>
                  {num}
                </div>
                <h3 className="vs-h3" style={{ marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* QUICKSTART + LIVE PLAYGROUND */}
          <div className="vs-grid-2" style={{ marginBottom: 60, alignItems: 'start' }}>
            <div className="vs-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Talking Avatar API Quickstart</h2>
                <div className="vs-segmented">
                  <button
                    type="button"
                    className={`vs-segmented-btn ${snippetTab === 'python' ? 'active' : ''}`}
                    onClick={() => setSnippetTab('python')}
                  >
                    Python SDK
                  </button>
                  <button
                    type="button"
                    className={`vs-segmented-btn ${snippetTab === 'curl' ? 'active' : ''}`}
                    onClick={() => setSnippetTab('curl')}
                  >
                    cURL
                  </button>
                </div>
              </div>

              <pre
                className="mono"
                style={{
                  background: 'hsl(222, 24%, 5%)',
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid var(--border-hairline)',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  lineHeight: 1.6,
                  color: 'hsl(168, 70%, 74%)',
                  marginBottom: 14,
                }}
              >
                {snippetTab === 'python' ? PYTHON_SDK_SNIPPET : CURL_SNIPPET}
              </pre>

              <button
                type="button"
                className="vs-btn vs-btn-secondary vs-btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(snippetTab === 'python' ? PYTHON_SDK_SNIPPET : CURL_SNIPPET);
                  showToast('Copied quickstart snippet!');
                }}
              >
                <Copy size={14} /> Copy Code
              </button>
            </div>

            {/* LIVE INTERACTIVE PLAYGROUND */}
            <div className="vs-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Terminal size={18} style={{ color: 'var(--accent-teal)' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Live OpenAPI Sandbox</h2>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <select
                  className="vs-select"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value as typeof endpoint)}
                >
                  <option value="POST /api/v1/video">POST /api/v1/video (Create Talking Video)</option>
                  <option value="GET /api/v1/credits">GET /api/v1/credits (Verify Balance)</option>
                  <option value="GET /api/v1/models">GET /api/v1/models (Discover Models)</option>
                  <option value="GET /api/v1/avatars">GET /api/v1/avatars (List Avatars)</option>
                  <option value="GET /api/v1/voices">GET /api/v1/voices (List Voices)</option>
                </select>

                <button
                  type="button"
                  className="vs-btn vs-btn-primary"
                  disabled={runningReq}
                  onClick={runLiveRequest}
                >
                  <Play size={15} /> {runningReq ? 'Running...' : 'Send'}
                </button>
              </div>

              {endpoint === 'POST /api/v1/video' && (
                <input
                  className="vs-input"
                  style={{ marginBottom: 12 }}
                  value={playgroundScript}
                  onChange={(e) => setPlaygroundScript(e.target.value)}
                  placeholder="text_script payload..."
                />
              )}

              <pre
                className="mono"
                style={{
                  background: 'hsl(222, 24%, 5%)',
                  padding: 14,
                  borderRadius: 12,
                  border: '1px solid var(--border-hairline)',
                  fontSize: '0.78rem',
                  maxHeight: 230,
                  overflowY: 'auto',
                  color: 'var(--text-secondary)',
                }}
              >
                {playgroundResponse}
              </pre>
            </div>
          </div>

          {/* API KEY MANAGEMENT */}
          <div id="api-keys" className="vs-card" style={{ padding: 28, marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <KeyRound size={20} style={{ color: 'var(--accent-brand)' }} />
              <h2 className="vs-h3">Server-Side API Keys (X-API-Key)</h2>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 18 }}>
              Generate authenticated VisionStory API keys for your backend services, CLI (`visionstory login`), or MCP client secret store.
            </p>

            <form onSubmit={handleCreateKey} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
              <input
                className="vs-input"
                style={{ maxWidth: 340 }}
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key description..."
              />
              <button type="submit" className="vs-btn vs-btn-primary">
                <Plus size={16} /> Create API Key
              </button>
            </form>

            {freshRawKey && (
              <div
                className="mono"
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'var(--accent-teal-soft)',
                  border: '1px solid hsla(168,76%,44%,0.35)',
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.84rem',
                }}
              >
                <span>New Key: <strong>{freshRawKey}</strong></span>
                <button
                  type="button"
                  className="vs-btn vs-btn-secondary vs-btn-sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(freshRawKey);
                    showToast('Copied API key!');
                  }}
                >
                  <Copy size={13} /> Copy
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-hairline)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <strong>{k.name}</strong>
                    <span className="mono" style={{ marginLeft: 12, color: 'var(--text-muted)' }}>
                      {k.rawPreview}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="vs-btn-ghost"
                    onClick={() => handleRevokeKey(k.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* API MODEL CATALOG */}
          <h2 className="vs-h2" style={{ marginBottom: 22 }}>VisionStory API Model Catalog</h2>
          <div className="vs-grid-3">
            {AI_MODELS.map((m) => (
              <div key={m.id} className="vs-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 750, fontSize: '1.08rem' }}>{m.name}</span>
                  <code className="vs-tag">{m.apiId}</code>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', flex: 1 }}>{m.summaryEn}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
                  {m.resolution} · {m.maxDuration} · {m.creditsPerUnit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
