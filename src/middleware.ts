import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user has a locale preference in cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;

  // If no cookie, detect from Accept-Language header
  if (!localeCookie) {
    const acceptLanguage = request.headers.get('accept-language');
    const preferredLocale = acceptLanguage?.startsWith('cs') ? 'cs' : 'en';

    // Set cookie for future requests
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', preferredLocale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)'],
};
