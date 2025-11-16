/??\/import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the response to avoid modifying the original
  const response = NextResponse.next();

  // Performance optimizations based on geolocation
  const country = request.nextUrl.searchParams.get('geo') ||
                 (request as any).geo?.country ||
                 'BR'; // Default to Brazil for ASoF

  // Set cache headers for static content
  if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('CDN-Cache-Control', 'max-age=31536000');
    response.headers.set('Vercel-CDN-Cache-Control', 'max-age=31536000');
  }

  // API routes optimization
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Use edge runtime for better performance
    response.headers.set('x-edge-runtime', '1');

    // CORS headers (complementing vercel.json configuration)
    const origin = request.headers.get('origin');
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      // For requests without origin header (e.g., same-origin), allow all
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    // API response caching
    if (request.method === 'GET') {
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');

      // Edge caching for frequently requested data
      response.headers.set('CDN-Cache-Control', 'max-age=300');
      response.headers.set('Vercel-CDN-Cache-Control', 'max-age=300');
    }
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy for ASoF website
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' *.vercel-analytics.com *.vercel-insights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: *.unsplash.com",
      "font-src 'self'",
      "connect-src 'self' *.vercel-analytics.com *.vercel-insights.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  );

  // Remove server information
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  // Geographic-based optimizations for ASoF (Sindicato dos Servidores do ME)
  if (country) {
    // Set language based on location (Brazil-focused)
    const locale = country === 'BR' ? 'pt-BR' : 'en-US';
    response.headers.set('X-Locale-Preference', locale);

    // Optimize for Brazilian users (main audience)
    if (country === 'BR') {
      response.cookies.set('preferred-region', 'br', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        sameSite: 'strict'
      });
    }
  }

  // Performance monitoring headers - static deployment time for cacheability
  const deploymentTime = process.env.DEPLOYMENT_TIME;
  if (deploymentTime) {
    response.headers.set('X-Deployment-Time', deploymentTime);
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
