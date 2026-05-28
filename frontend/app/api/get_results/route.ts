import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const adm = searchParams.get('adm')
    
    let url = 'http://localhost/edu/backend/get_results.php'
    if (adm) {
      url += `?adm=${encodeURIComponent(adm)}`
    }
    
    const response = await axios.get(url)
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
