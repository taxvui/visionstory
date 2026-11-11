import { NextResponse } from 'next/server';
import { AI_MODELS } from '@/lib/catalog';

export async function GET() {
  return NextResponse.json({
    models: AI_MODELS.map((m) => ({
      model_id: m.apiId,
      name: m.name,
      provider: m.provider,
      category: m.category,
      resolutions: m.resolution,
      max_duration: m.maxDuration,
      pricing_unit: m.creditsPerUnit,
      capabilities: m.capabilities,
    })),
  });
}
