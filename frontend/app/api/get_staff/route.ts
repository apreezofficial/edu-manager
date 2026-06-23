import { NextResponse } from 'next/server';
import { requestBackend } from '@/utils/backendProxy';

export async function GET() {
  try {
    const data = await requestBackend('/get_staff.php', 'GET');
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}