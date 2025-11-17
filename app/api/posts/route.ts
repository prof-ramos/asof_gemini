/**
 * API Route: Posts
 *
 * GET /api/posts - Lista todos os posts publicados
 * POST /api/posts - Cria um novo post (requer autenticação)
 *
 * Exemplo de integração Prisma com Next.js 15 App Router
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ContentStatus, UserRole } from '@prisma/client'
import { requireAuth } from '@/lib/auth-helpers'

// GET /api/posts - Listar posts publicados
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      status: ContentStatus.PUBLISHED,
      deletedAt: null,
    }

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (featured) {
      where.isFeatured = true
    }

    // Buscar posts com relações
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
          featuredImage: {
            select: {
              id: true,
              url: true,
              alt: true,
              width: true,
              height: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    // Transformar posts para formato de resposta
    const formattedPosts = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      viewCount: post.viewCount,
      isFeatured: post.isFeatured,
      author: post.author,
      category: post.category,
      featuredImage: post.featuredImage,
      tags: post.tags.map(pt => pt.tag),
    }))

    return NextResponse.json({
      success: true,
      data: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
      },
      { status: 500 }
    )
  }
}

// POST /api/posts - Criar novo post
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireAuth(request)
    if ('error' in authResult) {
      return authResult.error
    }

    const { session } = authResult

    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      status,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      publishedAt,
      scheduledAt,
      featuredImageId,
      isFeatured,
      categoryId,
      tagIds,
    } = body

    // Validação básica
    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campos obrigatórios faltando: title, slug, content',
        },
        { status: 400 }
      )
    }

    // Validar status de publicação
    if (status === ContentStatus.PUBLISHED) {
      const canPublish =
        session.user.role === UserRole.SUPER_ADMIN ||
        session.user.role === UserRole.ADMIN ||
        session.user.role === UserRole.EDITOR

      if (!canPublish) {
        return NextResponse.json(
          {
            success: false,
            error: 'Você não tem permissão para publicar posts. Envie para revisão.',
          },
          { status: 403 }
        )
      }
    }

    // Calcular reading time
    const readingTime = Math.ceil(content.split(/\s+/).length / 200)

    // Criar post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status: status || ContentStatus.DRAFT,
        authorId: session.user.id,
        categoryId,
        readingTime,
        metaTitle,
        metaDescription,
        metaKeywords,
        ogImage,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        featuredImageId,
        isFeatured: isFeatured || false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        featuredImage: true,
      },
    })

    // Adicionar tags se fornecidas
    if (tagIds && tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId: string) => ({
          postId: post.id,
          tagId,
        })),
      })
    }

    // Registrar no audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Post',
        entityId: post.id,
        userId: session.user.id,
        description: `Post criado: ${post.title}`,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao criar post',
      },
      { status: 500 }
    )
  }
}
