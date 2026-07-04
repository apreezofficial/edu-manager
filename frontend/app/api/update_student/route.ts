import { NextResponse } from 'next/server';
import { requestBackend } from '@/utils/backendProxy';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = await requestBackend('/update_student.php', 'POST', body);
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.response?.data?.error || err.message || 'Failed to update student' },
            { status: err.response?.status || 500 }
        );
    }
}
export const dynamic = 'force-dynamic';
