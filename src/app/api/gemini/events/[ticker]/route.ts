import { NextRequest, NextResponse } from 'next/server';
import { getEvent } from '@/lib/gemini';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const data = await getEvent(ticker);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Event API error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}
