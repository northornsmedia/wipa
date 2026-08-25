import { NextResponse } from 'next/server';
import { syncIPNewsToDatabase } from '@/lib/ipNewsFetcher';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const result = await syncIPNewsToDatabase();
    return NextResponse.json({
      success: result.success,
      inserted_count: result.insertedCount,
      total_count: result.totalLiveCount,
      timestamp: new Date().toISOString(),
      error: result.error,
    });
  } catch (error: any) {
    console.error('Error in sync-ip-news API route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
