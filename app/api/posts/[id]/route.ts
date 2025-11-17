import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { UpdatePostRequest } from '@/types/post'

/**
 * GET /api/posts/[id] - Retrieve a single post by ID
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the post ID
 * @returns Response with post data or error response
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: { include: { tag: true } },
      },
    })

    if (!post) {
      return NextResponse.json({ message: 'Post não encontrado' }, { status: 404 })
    }

    // Para posts publicados, é público
    if (post.status === 'PUBLISHED') {
      return NextResponse.json(post)
    }

    // Para posts não publicados, verificar autenticação
    const cookies = request.headers.get('cookie') || ''
    const authTokenMatch = cookies.match(/admin-auth-token=([^;]+)/)
    const authToken = authTokenMatch ? authTokenMatch[1] : null

    if (!authToken) {
      return NextResponse.json(
        { message: 'Não autorizado - Token de autenticação ausente' },
        { status: 401 }
      )
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken: authToken },
      include: { user: { select: { id: true, role: true } } },
    })

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { message: 'Não autorizado - Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    // Apenas ADMIN, EDITOR e AUTHOR podem ver posts em rascunho
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Não autorizado - Permissão insuficiente' },
        { status: 403 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { message: 'Um erro ocorreu ao buscar o post.' },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/posts/[id] - Update an existing post by ID
 * @param request - The incoming HTTP request with update data
 * @param params - Route parameters containing the post ID
 * @returns Response with updated post data or error response
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Verificar autenticação via cookie
  const cookies = request.headers.get('cookie') || ''
  const authTokenMatch = cookies.match(/admin-auth-token=([^;]+)/)
  const authToken = authTokenMatch ? authTokenMatch[1] : null

  if (!authToken) {
    return NextResponse.json(
      { message: 'Não autorizado - Token de autenticação ausente' },
      { status: 401 }
    )
  }

  try {
    // Validar sessão e extrair role
    const session = await prisma.session.findUnique({
      where: { sessionToken: authToken },
      include: { user: { select: { id: true, role: true } } },
    })

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { message: 'Não autorizado - Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    // Apenas ADMIN e EDITOR podem atualizar posts
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Não autorizado - Permissão insuficiente' },
        { status: 403 }
      )
    }

    const body: UpdatePostRequest = await request.json()
    const {
      title,
      content,
      slug,
      status,
      categoryId,
      isFeatured,
      publishedAt,
    } = body

    // Atualizar post SEM PERMITIR alteração do autor (imutável)
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        slug,
        status,
        categoryId,
        isFeatured,
        publishedAt,
        // authorId nunca é alterado após criação (mantém integridade)
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { message: 'Um erro ocorreu ao atualizar o post.' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/posts/[id] - Soft delete a post by ID
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the post ID
 * @returns Response with success message or error response
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Verificar autenticação via cookie
  const cookies = request.headers.get('cookie') || ''
  const authTokenMatch = cookies.match(/admin-auth-token=([^;]+)/)
  const authToken = authTokenMatch ? authTokenMatch[1] : null

  if (!authToken) {
    return NextResponse.json(
      { message: 'Não autorizado - Token de autenticação ausente' },
      { status: 401 }
    )
  }

  try {
    // Validar sessão e extrair role
    const session = await prisma.session.findUnique({
      where: { sessionToken: authToken },
      include: { user: { select: { role: true } } },
    })

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { message: 'Não autorizado - Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    // Apenas SUPER_ADMIN e ADMIN podem deletar posts
    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Não autorizado - Apenas administradores podem deletar posts' },
        { status: 403 }
      )
    }

    // Soft delete: marcar como deletado em vez de remover
    await prisma.post.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    })

    return NextResponse.json({ message: 'Post deletado com sucesso' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { message: 'Um erro ocorreu ao deletar o post.' },
      { status: 500 },
    )
  }
}
