import { NextRequest, NextResponse } from 'next/server';
import { readDB, verifyApiKey } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = readDB();
  const apiKey = req.headers.get('x-api-key');
  if (apiKey && !verifyApiKey(db, apiKey)) {
    return NextResponse.json({ error: 'Invalid X-API-Key' }, { status: 401 });
  }
  return NextResponse.json({
    account_id: db.user.id,
    plan: db.user.plan,
    credits_balance: db.user.credits,
    auto_recharge: db.user.autoRecharge,
    currency: 'credits',
  });
}
