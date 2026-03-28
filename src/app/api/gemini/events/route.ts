import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/gemini';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const data = await getEvents({
      status: params.getAll('status[]').length ? params.getAll('status[]') : undefined,
      category: params.getAll('category[]').length ? params.getAll('category[]') : undefined,
      search: params.get('search') || undefined,
      limit: params.get('limit') ? parseInt(params.get('limit')!) : 50,
      offset: params.get('offset') ? parseInt(params.get('offset')!) : undefined,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
