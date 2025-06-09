import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Disable Speed Insights
  if (request.nextUrl.pathname.startsWith('/_vercel')) {
    return new NextResponse(null, { status: 404 })
  }
  return NextResponse.next()
} 