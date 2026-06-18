import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('Authorized callback - token:', !!token)
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