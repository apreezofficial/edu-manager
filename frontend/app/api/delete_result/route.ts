import { NextResponse } from 'next/server'
import { requestBackend } from '../../../utils/backendProxy'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await requestBackend('/delete_result.php', 'POST', body)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API Route Error:', error.message)
    return NextResponse.json(
      { error: 'Failed to delete result', details: error.message },
      { status: 500 }
    )
  }
}
