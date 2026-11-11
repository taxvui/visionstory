# VisionStory AI — Full-Stack UI & Feature Clone

Full-stack Next.js (App Router + TypeScript + Vanilla CSS) clone of **VisionStory.ai** (`visionstory.ai` + `app.visionstory.ai` + `developers.visionstory.ai`), featuring bilingual **English / Tiếng Việt** support, real browser-side **Canvas + WebM Video & Audio Synthesis**, persistent local storage (`data/visionstory-db.json`), and a live **REST OpenAPI (`/api/v1/*`)**.

## Key Features

- **Marketing & Product Pages (`/`, `/pricing`, `/tools`, `/openapi`)**:
  - Mega-menu navigation, interactive Hero Studio Quick-Launcher, V-Character 4.0 showcase, AI Video Agent vs. Point Tools matrix, AI Music Video, AI Podcast, Face Swap dropzone, Seedance 2.5 / Kling O3 / MiniMax H3 / Wan 3.0 model catalog, CLI/MCP coding-agent prompt switcher, G2 reviews, and FAQs.
  - Complete **Pricing** page (`Free`, `Pro $9.99`, `Advanced $29.9`, `Ultra $99.9`, Monthly/Annual 2-months-free toggle, Auto Recharge, Credit Usage Ledger, and interactive V-Character 4.0 credit calculator).
- **Creator Studio (`/studio` — 8 Complete Workflows)**:
  1. **AI Video (`V-Character 4.0` / `5.0 Pro`)**: Presenter & Cinematic modes, Stock + Custom Uploaded Avatars, Script / Audio / Music inputs, 88-language TTS preview, Speed control, Aspect Ratio (`9:16`, `1:1`, `16:9`), Resolution (`720p`, `1080p`, `2K`), Green Screen (`#00D448`), live **Credits Bill** breakdown, and downloadable `.webm` rendering.
  2. **AI Video Agent**: Prompt/URL-to-multi-shot storyboard planner + interactive **Chat-to-Refine** scene editor.
  3. **Viral Music Video**: Suno/Udio/MP3 song + portrait singing performance renderer with beat-reactive spectrum & stage lighting.
  4. **Video & Photo Face Swap**: Free (0-credit, watermark-free) face identity + target scene composite renderer.
  5. **Seedance 2.5 & Video Models**: Switch between `Seedance 2.5`, `Kling O3`, `MiniMax H3`, and `Wan 3.0` (`5s`–`30s` clips).
  6. **Video Podcast**: Dual-host split-screen `ON AIR` broadcast studio with alternating speaker highlights & waveforms.
  7. **AI Presentation**: Slide deck editor rendered with circular Picture-in-Picture talking presenter.
  8. **AI Tools Suite**: Instant Neural **Voice Clone** (mic/file), **Text to Speech**, **Nano Banana 2** 2K Image Generator, **1-Click Background Remover / Green Screen Cutout**, **2K/4× Image Upscaler**, and **Web Audio Noise Removal & Voice Changer** (`.wav` export).
- **Developer OpenAPI (`/api/v1/*`)**:
  - `GET /api/v1/credits`
  - `GET /api/v1/models`
  - `GET /api/v1/avatars`
  - `GET /api/v1/voices`
  - `GET /api/v1/video` & `POST /api/v1/video` (authenticated via `X-API-Key`)

## Getting Started

```bash
npm install
npm run dev
```

Optional external cloud provider keys (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, `REPLICATE_API_TOKEN`) can be configured directly via the key icon in the top navigation bar or via `.env.local`.
