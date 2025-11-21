import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { UserStatus } from '@prisma/client'

interface LoginRequest {
  email: string
  password: string
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

    // Buscar usuário no banco de dados Prisma
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        status: true,
        failedLoginCount: true,
        lockedUntil: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Verificar se a conta está ativa
    if (user.status !== UserStatus.ACTIVE) {
      return NextResponse.json(
        { error: 'Conta inativa ou suspensa. Entre em contato com o administrador.' },
        { status: 403 }
      )
    }

    // Verificar se a conta está bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: 'Conta temporariamente bloqueada. Tente novamente mais tarde.' },
        { status: 403 }
      )
    }

    // Validar senha com bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      // Incrementar contador de tentativas falhadas
      const failedCount = user.failedLoginCount + 1
      const shouldLock = failedCount >= 5

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: failedCount,
          lockedUntil: shouldLock
            ? new Date(Date.now() + 30 * 60 * 1000) // Bloquear por 30 minutos
            : null,
        },
      })

      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Resetar contador de tentativas falhadas e atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown',
      },
    })

    // Gerar token de autenticação seguro
    // Usa randomBytes para gerar um token criptograficamente seguro
    const authToken = randomBytes(32).toString('hex')

    // Criar sessão no banco de dados
    const session = await prisma.session.create({
      data: {
        sessionToken: authToken,
        userId: user.id,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        ipAddress: request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // Registrar login no audit log
    await prisma.auditLog.create({
      data: {
        action: 'LOGIN',
        entityType: 'User',
        entityId: user.id,
        userId: user.id,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        description: `Login bem-sucedido: ${user.email}`,
      },
    })

    // Criar resposta com cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
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

    console.log('✅ Login bem-sucedido:', user.email, '- Role:', user.role)

    return response
  } catch (error) {
    console.error('❌ Erro durante login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
