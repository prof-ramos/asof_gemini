import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { get } from '@vercel/edge-config'

// Rotas que requerem autenticação
const PROTECTED_ROUTES = ['/admin']

// Rota de login
const LOGIN_ROUTE = '/login'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se a rota é protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Verificar autenticação
  const authToken = request.cookies.get('admin-auth-token')?.value

  if (!authToken) {
    // Redirecionar para login se não autenticado
    const loginUrl = new URL(LOGIN_ROUTE, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar se o token é válido via Edge Config
  try {
    const validTokens = await get<string[]>('admin_tokens')

    if (!validTokens || !validTokens.includes(authToken)) {
      // Token inválido, redirecionar para login
      const loginUrl = new URL(LOGIN_ROUTE, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('admin-auth-token')
      return response
    }

    // Token válido, permitir acesso
    return NextResponse.next()
  } catch (error) {
    console.error('Error checking auth token:', error)

    // Em caso de erro (ex: Edge Config não configurado),
    // permitir acesso em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Edge Config not configured, allowing access in development mode')
      return NextResponse.next()
    }

    // Em produção, redirecionar para login
    const loginUrl = new URL(LOGIN_ROUTE, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
