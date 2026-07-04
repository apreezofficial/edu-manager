import { NextResponse } from 'next/server';
import { requestBackend } from '@/utils/backendProxy';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adm = searchParams.get('adm');
    const data = await requestBackend('/get_results.php', 'GET', adm ? { adm } : {});
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
