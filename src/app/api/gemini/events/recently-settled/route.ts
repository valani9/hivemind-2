import { NextResponse } from 'next/server';
import { getRecentlySettled } from '@/lib/gemini';

export async function GET() {
  try {
    const data = await getRecentlySettled({ limit: 50 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Recently settled API error:', error);
    return NextResponse.json({ error: 'Failed to fetch settled events' }, { status: 500 });
  }
}
