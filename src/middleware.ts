import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'
import { CORRELATION_ID_HEADER, getOrCreateCorrelationId } from '@/lib/correlation-id'

export default withAuth(
  function middleware(req: NextRequest) {
    const requestHeaders = new Headers(req.headers)
    
    // Correlation Id
    const correlationId = getOrCreateCorrelationId(requestHeaders)
    requestHeaders.set(CORRELATION_ID_HEADER, correlationId)
    
    // Client IP
    const forwardedFor = req.headers.get('x-forwarded-for')
    const clientIp =
      forwardedFor?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    console.log('Client IP: ', clientIp)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    response.headers.set(CORRELATION_ID_HEADER, correlationId)

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        return !!token
      }
    },
    pages: {
      signIn: '/sign-in',
    }
  }
)

export const config = {
  matcher: [
    '/',
    // Exclude public routes
    '/((?!sign-in|sign-up|recovery|info|induction/complete|api|_next/static|_next/image|favicon.ico).*)',
  ]
}