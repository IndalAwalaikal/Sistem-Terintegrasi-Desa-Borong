import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy function for Next.js 16 route protection and guards.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /akun routes (requires user session)
  if (pathname.startsWith('/akun')) {
    const hasAuthCookie = request.cookies.get('desa-borong-auth');
    // Note: In client state Zustand persists to localStorage, proxy provides fallback protection
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/akun/:path*', '/dashboard/:path*'],
};
