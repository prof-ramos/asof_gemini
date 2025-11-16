import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

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

  // Verificar se o token é válido no banco de dados
  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken: authToken },
      include: {
        user: {
          select: {
            status: true,
          },
        },
      },
    })

    // Verificar se a sessão existe e é válida
    if (!session) {
      console.warn('⚠️  Session not found for token')
      const loginUrl = new URL(LOGIN_ROUTE, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('admin-auth-token')
      return response
    }

    // Verificar se a sessão expirou
    if (session.expires < new Date()) {
      console.warn('⚠️  Session expired')
      const loginUrl = new URL(LOGIN_ROUTE, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('admin-auth-token')

      // Deletar sessão expirada
      await prisma.session.delete({
        where: { sessionToken: authToken },
      })

      return response
    }

    // Verificar se o usuário está ativo
    if (session.user.status !== 'ACTIVE') {
      console.warn('⚠️  User is not active')
      const loginUrl = new URL(LOGIN_ROUTE, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('admin-auth-token')
      return response
    }

    // Sessão válida, permitir acesso
    console.log('✅ Valid session for user:', session.userId)
    return NextResponse.next()
  } catch (error) {
    console.error('❌ Error checking auth token:', error)

    // Em caso de erro no database, redirecionar para login em produção
    // Em desenvolvimento, permitir acesso para facilitar debug
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Database error, allowing access in development mode')
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
