import { NextResponse, NextRequest } from 'next/server'
import axios from '../../../utils/axiosInstance'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const adm = searchParams.get('adm')
    const body = await request.json()
    
    const response = await axios.post('/backend/save_result.php', body)
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('API Route Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    })
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch results', details: error.message },
      { status: error.response?.status || 500 }
    )
  }
}
