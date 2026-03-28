import { NextRequest, NextResponse } from 'next/server';
import { getTicker } from '@/lib/gemini';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const data = await getTicker(symbol);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Ticker API error:', error);
    return NextResponse.json({ error: 'Failed to fetch ticker' }, { status: 500 });
  }
}
