import { NextRequest, NextResponse } from 'next/server';
import { getOrderBook } from '@/lib/gemini';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const data = await getOrderBook(symbol);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Order book API error:', error);
    return NextResponse.json({ error: 'Failed to fetch order book' }, { status: 500 });
  }
}
