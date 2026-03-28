import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/gemini';

export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
