import { NextRequest, NextResponse } from 'next/server';
import { readDB, StoryboardShot } from '@/lib/db';

function buildLocalStoryboard(prompt: string, isVi: boolean): {
  title: string;
  shots: StoryboardShot[];
  fullScript: string;
} {
  const cleanTopic = prompt
    .replace(/^https?:\/\/[^\s]+/i, (url) => `product from ${url.replace(/^https?:\/\//, '').split('/')[0]}`)
    .trim();
  const subject = cleanTopic || (isVi ? 'Giải pháp AI Video thế hệ mới' : 'Next-Gen AI Video Workflow');

  if (isVi || /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(subject)) {
    const shots: StoryboardShot[] = [
      {
        id: 'shot_1',
        shotNumber: 1,
        title: 'Mở đầu thu hút (Hook)',
        script: `Bạn muốn biến ý tưởng "${subject.slice(0, 65)}" thành video chuyên nghiệp chỉ trong vài phút mà không cần máy quay?`,
        visualPrompt: 'Cận cảnh MC AI nhìn thẳng ống kính trong studio ánh sáng ấm',
        cameraMotion: 'Slow Dolly In',
        durationSec: 5,
      },
      {
        id: 'shot_2',
        shotNumber: 2,
        title: 'Điểm nổi bật & Giá trị cốt lõi',
        script: 'VisionStory tự động viết kịch bản, đồng bộ khẩu hình V-Character 4.0 và lồng tiếng tự nhiên trên 88 ngôn ngữ.',
        visualPrompt: 'Góc trung cảnh kèm bảng thông tin trực quan bên cạnh MC',
        cameraMotion: 'Subtle Pan Right',
        durationSec: 5,
      },
      {
        id: 'shot_3',
        shotNumber: 3,
        title: 'Trải nghiệm thực tế & Tối ưu chi phí',
        script: 'Dễ dàng chỉnh sửa từng phân cảnh bằng trò chuyện và xuất bản sắc nét ở tỷ lệ 9:16, 16:9 hoặc 2K.',
        visualPrompt: 'Góc quay năng động nhấn mạnh biểu cảm tay và ánh mắt tự nhiên',
        cameraMotion: 'Gentle Zoom Out',
        durationSec: 5,
      },
      {
        id: 'shot_4',
        shotNumber: 4,
        title: 'Kêu gọi hành động (CTA)',
        script: 'Bắt đầu miễn phí ngay hôm nay để nhân đôi tốc độ sản xuất nội dung cho thương hiệu của bạn!',
        visualPrompt: 'Khung hình chính diện sắc nét kèm phụ đề CTA nổi bật',
        cameraMotion: 'Studio Locked Shot',
        durationSec: 4,
      },
    ];
    return {
      title: `AI Agent · ${subject.slice(0, 48)}`,
      shots,
      fullScript: shots.map((s) => s.script).join(' '),
    };
  }

  const shots: StoryboardShot[] = [
    {
      id: 'shot_1',
      shotNumber: 1,
      title: 'Attention Hook',
      script: `Here is how teams turn "${subject.slice(0, 65)}" into a high-converting presenter video without booking a studio.`,
      visualPrompt: 'Medium close-up of AI presenter in warm architectural studio lighting',
      cameraMotion: 'Slow Dolly In',
      durationSec: 5,
    },
    {
      id: 'shot_2',
      shotNumber: 2,
      title: 'Core Problem & Breakthrough',
      script: 'Instead of juggling five disconnected tools for scripts, voiceovers, and editing, everything happens in one unified flow.',
      visualPrompt: 'Dynamic presenter framing with crisp depth of field',
      cameraMotion: 'Subtle Pan Right',
      durationSec: 5,
    },
    {
      id: 'shot_3',
      shotNumber: 3,
      title: 'Product Proof & Localization',
      script: 'V-Character 4.0 keeps your spokesperson consistent across every angle, 88 languages, and crisp 2K resolution.',
      visualPrompt: 'Expressive hand gestures and natural eye contact on key benefit',
      cameraMotion: 'Gentle Zoom Out',
      durationSec: 5,
    },
    {
      id: 'shot_4',
      shotNumber: 4,
      title: 'Clear Call to Action',
      script: 'Start free today, refine any shot by chatting, and ship publish-ready videos in minutes.',
      visualPrompt: 'Centered broadcast close-up with bold lower-third CTA',
      cameraMotion: 'Studio Locked Shot',
      durationSec: 4,
    },
  ];

  return {
    title: `AI Agent · ${subject.slice(0, 48)}`,
    shots,
    fullScript: shots.map((s) => s.script).join(' '),
  };
}

function applyChatRevision(
  existingShots: StoryboardShot[],
  instruction: string
): { shots: StoryboardShot[]; reply: string } {
  const lower = instruction.toLowerCase();
  let updated = existingShots.map((s) => ({ ...s }));

  if (lower.includes('viet') || lower.includes('tiếng việt') || lower.includes('dịch')) {
    updated = [
      {
        ...updated[0],
        title: 'Mở đầu ấn tượng (Hook)',
        script: 'Khám phá cách biến mọi ý tưởng thành video MC AI sắc nét chỉ trong vài phút mà không cần quay dựng.',
      },
      ...updated.slice(1).map((s, idx) => ({
        ...s,
        title: `Phân cảnh 0${idx + 2} · Tối ưu Việt hóa`,
        script:
          idx === 0
            ? 'Tự động lên kịch bản, nhép môi V-Character 4.0 và lồng tiếng truyền cảm hứng chuẩn phòng thu.'
            : 'Chỉnh sửa linh hoạt từng cảnh quay và xuất video chuẩn HD, 2K cho TikTok, YouTube và Reels.',
      })),
    ];
    return {
      shots: updated,
      reply: 'Đã chuyển đổi toàn bộ phân cảnh và lời thoại sang Tiếng Việt tự nhiên, giữ nguyên nhịp độ khung hình.',
    };
  }

  if (lower.includes('add') || lower.includes('thêm') || lower.includes('pricing') || lower.includes('giá')) {
    const nextNum = updated.length + 1;
    updated.push({
      id: `shot_${Date.now()}`,
      shotNumber: nextNum,
      title: 'Transparent Pricing & ROI',
      script: 'Plans start free with 10 sign-up credits, and Pro unlocks watermark-free videos for just $9.99 a month.',
      visualPrompt: 'Presenter highlighting ROI metrics with confident smile',
      cameraMotion: 'Slow Dolly In',
      durationSec: 5,
    });
    return {
      shots: updated,
      reply: `Added Shot 0${nextNum} ("Transparent Pricing & ROI") to your storyboard.`,
    };
  }

  if (lower.includes('short') || lower.includes('ngắn') || lower.includes('punch')) {
    updated = updated.map((s) => ({
      ...s,
      script: s.script.split(',')[0].replace(/\.?$/, '!'),
      durationSec: Math.max(3, s.durationSec - 1),
    }));
    return {
      shots: updated,
      reply: 'Tightened every shot into a punchier, high-retention social hook and trimmed pacing.',
    };
  }

  // Targeted shot edit e.g. "shot 2" or "cảnh 1"
  const shotMatch = lower.match(/(?:shot|scene|cảnh)\s*(\d+)/);
  if (shotMatch) {
    const idx = Math.max(0, Math.min(updated.length - 1, Number(shotMatch[1]) - 1));
    updated[idx] = {
      ...updated[idx],
      script: `${updated[idx].script} (${instruction.trim()})`,
      cameraMotion: 'Dynamic Orbit Push',
    };
    return {
      shots: updated,
      reply: `Updated Shot 0${idx + 1} with your direction and refreshed camera movement.`,
    };
  }

  updated[0] = {
    ...updated[0],
    script: `${instruction.trim()} — ${updated[0].script}`,
  };
  return {
    shots: updated,
    reply: 'Applied your creative direction to the lead opening shot and updated captions.',
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDB();
  const openaiKey = db.providerKeys.openaiApiKey || process.env.OPENAI_API_KEY;
  const isVi = body.locale === 'vi';

  // Revision chat mode
  if (body.mode === 'revise' && Array.isArray(body.shots)) {
    const result = applyChatRevision(body.shots, String(body.instruction || ''));
    return NextResponse.json({
      ok: true,
      shots: result.shots,
      fullScript: result.shots.map((s) => s.script).join(' '),
      reply: result.reply,
    });
  }

  const prompt = String(body.prompt || '');

  // If external OpenAI key is configured, try live LLM storyboard generation with automatic local fallback
  if (openaiKey && prompt.trim()) {
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You are VisionStory AI Video Agent. Return JSON with {"title": string, "shots": [{"id": "shot_1", "shotNumber": 1, "title": string, "script": string, "visualPrompt": string, "cameraMotion": string, "durationSec": 5}]} with 4 concise presenter shots.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        if (Array.isArray(parsed.shots) && parsed.shots.length > 0) {
          return NextResponse.json({
            ok: true,
            provider: 'openai',
            title: parsed.title || 'AI Agent Video',
            shots: parsed.shots,
            fullScript: parsed.shots.map((s: StoryboardShot) => s.script).join(' '),
          });
        }
      }
    } catch {
      // Fallback cleanly to built-in VisionStory planner
    }
  }

  const planned = buildLocalStoryboard(prompt, isVi);
  return NextResponse.json({
    ok: true,
    provider: 'visionstory-native',
    ...planned,
  });
}
