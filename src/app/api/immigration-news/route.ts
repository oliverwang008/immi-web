import { NextResponse } from 'next/server';
import { fetchAllImmigrationNews } from '@/lib/immigration-news';

export const revalidate = 3600;

export async function GET() {
  try {
    const news = await fetchAllImmigrationNews();
    return NextResponse.json(news, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
