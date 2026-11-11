import { NextResponse } from 'next/server';
import { getAllAvatars, readDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const avatars = getAllAvatars(db);
  return NextResponse.json({
    avatars: avatars.map((a) => ({
      avatar_id: a.id,
      name: a.name,
      role: a.role,
      category: a.category,
      preview_url: a.image,
      default_voice_id: a.defaultVoiceId,
      supported_languages: a.languages,
    })),
  });
}
