import { NextResponse } from 'next/server';
import { getAllVoices, readDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const voices = getAllVoices(db);
  return NextResponse.json({
    voices: voices.map((v) => ({
      voice_id: v.id,
      name: v.name,
      language: v.language,
      language_code: v.languageCode,
      gender: v.gender,
      is_cloned: Boolean(v.isCloned),
      sample_text: v.sampleText,
    })),
  });
}
