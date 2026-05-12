import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/403', '/tools'];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as any;

    // Public paths and dashboard — no role check needed
    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();
    if (pathname === '/') return NextResponse.next();

    // Role-based page access (skip for Admin role = id 1)
    const isAdmin = token?.roleId === 1;
    if (!isAdmin) {
      const allowedPages: string[] = token?.allowedPages ?? [];
      if (allowedPages.length > 0) {
        const hasAccess = allowedPages.some(p => pathname.startsWith(p));
        if (!hasAccess) return NextResponse.redirect(new URL('/403', req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        // Always allow public paths — this prevents the redirect loop
        if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return true;
        // All other paths require a valid session token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
