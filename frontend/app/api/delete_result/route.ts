import { NextResponse } from 'next/server'
import axios from '../../../utils/axiosInstance'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await axios.post('http://localhost/edu/backend/delete_result.php', body)
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('API Route Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to delete result', details: error.message },
      { status: error.response?.status || 500 }
    )
  }
}
