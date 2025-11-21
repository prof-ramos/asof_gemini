/**
 * Authentication Helpers
 *
 * Funções para verificar autenticação e autorização nas APIs
 */

import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
  session: {
    id: string
    expires: Date
  }
}

/**
 * Verifica se o usuário está autenticado via cookie de sessão
 * @param request - Request do Next.js
 * @returns AuthSession se autenticado, null caso contrário
 */
export async function getAuthSession(request: NextRequest): Promise<AuthSession | null> {
  try {
    // Obter token do cookie
    const token = request.cookies.get('admin-auth-token')?.value

    if (!token) {
      return null
    }

    // Buscar sessão no banco de dados
    const session = await prisma.session.findUnique({
      where: {
        sessionToken: token,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
          },
        },
      },
    })

    // Verificar se sessão existe e não expirou
    if (!session || session.expires < new Date()) {
      return null
    }

    // Verificar se usuário está ativo
    if (session.user.status !== 'ACTIVE') {
      return null
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      session: {
        id: session.id,
        expires: session.expires,
      },
    }
  } catch (error) {
    console.error('Error verifying authentication:', error)
    return null
  }
}

/**
 * Verifica se o usuário tem uma das roles permitidas
 * @param session - Sessão de autenticação
 * @param allowedRoles - Roles permitidas
 * @returns true se autorizado, false caso contrário
 */
export function isAuthorized(
  session: AuthSession | null,
  allowedRoles: UserRole[]
): boolean {
  if (!session) {
    return false
  }

  return allowedRoles.includes(session.user.role)
}

/**
 * Middleware helper: Requer autenticação
 * Retorna a sessão se autenticado, ou um Response 401 se não autenticado
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ session: AuthSession } | { error: Response }> {
  const session = await getAuthSession(request)

  if (!session) {
    return {
      error: Response.json(
        {
          success: false,
          error: 'Não autenticado. Faça login para acessar este recurso.',
        },
        { status: 401 }
      ),
    }
  }

  return { session }
}

/**
 * Middleware helper: Requer autenticação com role específica
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<{ session: AuthSession } | { error: Response }> {
  const authResult = await requireAuth(request)

  if ('error' in authResult) {
    return authResult
  }

  if (!isAuthorized(authResult.session, allowedRoles)) {
    return {
      error: Response.json(
        {
          success: false,
          error: 'Permissão negada. Você não tem autorização para acessar este recurso.',
        },
        { status: 403 }
      ),
    }
  }

  return { session: authResult.session }
}

/**
 * Verifica se o usuário pode editar um post
 * - Super Admin e Admin podem editar qualquer post
 * - Editor pode editar qualquer post
 * - Author pode editar apenas seus próprios posts
 */
export function canEditPost(session: AuthSession, postAuthorId: string): boolean {
  const { role, id } = session.user

  // Super Admin e Admin podem editar qualquer post
  if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
    return true
  }

  // Editor pode editar qualquer post
  if (role === UserRole.EDITOR) {
    return true
  }

  // Author pode editar apenas seus próprios posts
  if (role === UserRole.AUTHOR && id === postAuthorId) {
    return true
  }

  return false
}

/**
 * Verifica se o usuário pode deletar um post
 * - Apenas Super Admin e Admin podem deletar posts
 */
export function canDeletePost(session: AuthSession): boolean {
  const { role } = session.user

  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN
}

/**
 * Verifica se o usuário pode publicar um post
 * - Super Admin, Admin e Editor podem publicar
 * - Author não pode publicar (precisa de aprovação)
 */
export function canPublishPost(session: AuthSession): boolean {
  const { role } = session.user

  return (
    role === UserRole.SUPER_ADMIN ||
    role === UserRole.ADMIN ||
    role === UserRole.EDITOR
  )
}
