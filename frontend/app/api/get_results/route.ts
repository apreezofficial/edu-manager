import { NextResponse, NextRequest } from 'next/server';
import { requestBackend } from '../../utils/backendProxy';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const adm = searchParams.get('adm');
    const data = await requestBackend('/get_results.php', 'GET', { adm, i: 1 });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Route Error:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to fetch results',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
