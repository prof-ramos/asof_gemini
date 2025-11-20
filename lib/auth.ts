import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { UserRole, UserStatus } from '@prisma/client'

export interface AuthSession {
  sessionToken: string
  userId: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    status: UserStatus
  }
}

export interface AuthValidationOptions {
  requireRoles?: UserRole[]
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Valida autenticação do usuário via cookie e sessão no banco de dados
 *
 * @param options - Opções de validação (ex: roles requeridas)
 * @returns Dados da sessão autenticada
 * @throws AuthError se não autenticado ou sem permissão
 */
export async function validateAuth(
  options: AuthValidationOptions = {}
): Promise<AuthSession> {
  // 1. Buscar cookie de autenticação
  const cookieStore = await cookies()
  const authToken = cookieStore.get('admin-auth-token')?.value

  if (!authToken) {
    throw new AuthError('Não autenticado - Token não encontrado', 401)
  }

  // 2. Buscar sessão no banco de dados
  const session = await prisma.session.findUnique({
    where: { sessionToken: authToken },
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

  // 3. Validar se sessão existe
  if (!session) {
    throw new AuthError('Sessão inválida ou expirada', 401)
  }

  // 4. Validar se sessão não expirou
  if (session.expires < new Date()) {
    // Deletar sessão expirada do banco
    await prisma.session.delete({
      where: { sessionToken: authToken },
    })
    throw new AuthError('Sessão expirada', 401)
  }

  // 5. Validar se usuário está ativo
  if (session.user.status !== UserStatus.ACTIVE) {
    throw new AuthError(
      'Conta inativa ou suspensa. Entre em contato com o administrador.',
      403
    )
  }

  // 6. Validar role se necessário
  if (options.requireRoles && options.requireRoles.length > 0) {
    if (!options.requireRoles.includes(session.user.role)) {
      throw new AuthError(
        `Acesso negado. Requer uma das seguintes permissões: ${options.requireRoles.join(', ')}`,
        403
      )
    }
  }

  // 7. Retornar dados da sessão
  return {
    sessionToken: session.sessionToken,
    userId: session.userId,
    user: session.user,
  }
}
