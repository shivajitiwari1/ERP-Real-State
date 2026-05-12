import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as any;

    const publicPaths = ['/login', '/403', '/tools'];
    if (publicPaths.some(p => pathname.startsWith(p))) return NextResponse.next();
    if (pathname === '/') return NextResponse.next();

    const allowedPages: string[] = token?.allowedPages ?? [];
    const isAdmin = token?.roleId === 1; // Admin role always has full access
    if (!isAdmin && allowedPages.length > 0) {
      const hasAccess = allowedPages.some(p => pathname.startsWith(p));
      if (!hasAccess) return NextResponse.redirect(new URL('/403', req.url));
    }
    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
