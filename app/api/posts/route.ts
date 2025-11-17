import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { CreatePostRequest } from '@/types/post'

/**
 * GET /api/posts - Retrieve all published posts with pagination support
 * @param request - The incoming HTTP request containing query parameters
 * @returns Response with paginated posts data or error response
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const category = searchParams.get('category')

    const where: Prisma.PostWhereInput = {
      status: 'PUBLISHED',
      deletedAt: null,
    }

    if (category) {
      where.category = { slug: category }
    }

    const total = await prisma.post.count({ where })
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true, avatar: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching published posts:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching posts.' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/posts - Create a new post
 * @param request - The incoming HTTP request with post data
 * @returns Response with created post data or error response
 */
export async function POST(request: Request) {
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
    // Validar sessão e extrair userId
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

    // Verificar permissões: apenas ADMIN, EDITOR e AUTHOR podem criar posts
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Não autorizado - Permissão insuficiente' },
        { status: 403 }
      )
    }

    const body: CreatePostRequest = await request.json()
    const {
      title,
      content,
      status,
      categoryId,
      isFeatured,
      publishedAt,
    } = body

    // Basic validation
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Título e conteúdo são obrigatórios.' },
        { status: 400 },
      )
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const post = await prisma.post.create({
      data: {
        title,
        slug, // Simple slug generation
        content,
        status,
        categoryId,
        isFeatured,
        publishedAt,
        authorId: session.user.id, // Usar userId da sessão autenticada
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { message: 'An error occurred while creating the post.' },
      { status: 500 },
    )
  }
}
