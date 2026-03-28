import { NextResponse } from 'next/server';
import { getNewlyListed } from '@/lib/gemini';

export async function GET() {
  try {
    const data = await getNewlyListed({ limit: 50 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Newly listed API error:', error);
    return NextResponse.json({ error: 'Failed to fetch newly listed' }, { status: 500 });
  }
}
