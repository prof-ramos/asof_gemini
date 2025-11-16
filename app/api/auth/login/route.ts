import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'
import { createHash } from 'crypto'

interface LoginRequest {
  email: string
  password: string
}

interface AdminUser {
  email: string
  passwordHash: string
  name: string
  role: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuários autorizados do Edge Config
    let adminUsers: AdminUser[] = []

    try {
      const users = await get<AdminUser[]>('admin_users')
      if (users) {
        adminUsers = users
      }
    } catch (error) {
      console.error('Error fetching admin users from Edge Config:', error)

      // Fallback para desenvolvimento (remover em produção)
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Edge Config not configured, using development credentials')
        adminUsers = [
          {
            email: 'admin@asof.org.br',
            // Hash SHA-256 de 'admin123' (usar bcrypt em produção)
            passwordHash: createHash('sha256').update('admin123').digest('hex'),
            name: 'Administrador',
            role: 'ADMIN',
          },
        ]
      } else {
        return NextResponse.json(
          { error: 'Serviço de autenticação indisponível' },
          { status: 503 }
        )
      }
    }

    // Buscar usuário por email
    const user = adminUsers.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Validar senha (SHA-256 simples, considerar bcrypt em produção)
    const passwordHash = createHash('sha256').update(password).digest('hex')

    if (passwordHash !== user.passwordHash) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Gerar token de autenticação
    const authToken = createHash('sha256')
      .update(`${user.email}:${Date.now()}:${process.env.AUTH_SECRET}`)
      .digest('hex')

    // Armazenar token válido no Edge Config (ou em memória para desenvolvimento)
    // Em produção, você deve adicionar o token ao Edge Config via API
    // Por enquanto, vamos apenas criar o cookie com o token

    // Criar resposta com cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    )

    // Definir cookie de autenticação (7 dias)
    response.cookies.set('admin-auth-token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    // Em desenvolvimento, adicionar o token à lista de tokens válidos
    // Em produção, isso deve ser feito via Edge Config API
    if (process.env.NODE_ENV === 'development') {
      // Armazenar em memória (não persistente, apenas para desenvolvimento)
      console.log('✅ Login bem-sucedido:', user.email)
      console.log('🔑 Auth Token:', authToken)
    }

    return response
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
