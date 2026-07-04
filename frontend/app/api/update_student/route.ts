import { NextResponse } from 'next/server';
import { requestBackend } from '@/utils/backendProxy';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const adm = body.admission_number || body.admissionNumber;
        const payload = {
            ...body,
            admissionNumber: adm,
            admission_number: adm
        };
        const data = await requestBackend('/update_student.php', 'POST', payload);
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.response?.data?.error || err.message || 'Failed to update student' },
            { status: err.response?.status || 500 }
        );
    }
}
export const dynamic = 'force-dynamic';
