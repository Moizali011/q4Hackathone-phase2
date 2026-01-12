import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = ['/auth'];
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Get token from cookies or headers (for server-side) or from the request
  const token = request.cookies.get('access_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // For protected routes, redirect to auth if no token
  if (!isPublicRoute && !token) {
    // Check if the user has a token in localStorage (client-side check)
    // This is trickier in middleware, so we'll implement a more robust approach
    const hasLocalStorageToken = request.headers.get('x-has-local-storage-token');

    // If it's the home page and no token is found, redirect to auth
    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/dashboard') {
      // Check for the token in various ways
      const tokenExists = token || hasLocalStorageToken;

      if (!tokenExists) {
        return NextResponse.redirect(new URL('/auth', request.url));
      }
    }
  }

  // If user is trying to access auth pages but is already logged in
  if (isPublicRoute && token) {
    if (request.nextUrl.pathname === '/auth') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};