import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
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
    '/((?!sign-in|sign-up|recovery|info|api|_next/static|_next/image|favicon.ico).*)',
  ]
}