import { NextResponse } from 'next/server';
import { requestBackend } from '@/utils/backendProxy';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await requestBackend('/delete_staff.php', 'POST', body);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete staff' },
      { status: 500 }
    );
  }
}