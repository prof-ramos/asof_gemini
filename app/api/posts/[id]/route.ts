import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { validateAuth, AuthError } from '@/lib/auth'
import { UserRole } from '@prisma/client'

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
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    // For published posts, it's public
    if (post.status === 'PUBLISHED') {
      return NextResponse.json(post)
    }

    // For non-published posts, require authentication
    let session
    try {
      session = await validateAuth({
        requireRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR, UserRole.AUTHOR],
      })
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode })
      }
      return NextResponse.json({ error: 'Erro de autenticação' }, { status: 500 })
    }

    // Verificar ownership para AUTHOR role (só pode visualizar próprios posts não publicados)
    if (session.user.role === UserRole.AUTHOR && post.author.id !== session.userId) {
      return NextResponse.json({
        error: 'Acesso negado. Você só pode visualizar seus próprios posts não publicados.'
      }, { status: 403 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching the post.' },
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
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Validar autenticação e permissões
  let session
  try {
    session = await validateAuth({
      requireRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR, UserRole.AUTHOR],
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Erro de autenticação' }, { status: 500 })
  }

  try {

    // Parse request body
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      status,
      categoryId,
      featuredImageId,
      metaTitle,
      metaDescription,
      ogImage,
      isFeatured,
      scheduledAt,
    } = body

    // Get existing post to check version
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        revisions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Verificar ownership para AUTHOR role (só pode editar próprios posts)
    if (session.user.role === UserRole.AUTHOR && existingPost.authorId !== session.userId) {
      return NextResponse.json({
        error: 'Acesso negado. Você só pode editar seus próprios posts.'
      }, { status: 403 })
    }

    // Calculate reading time
    const words = content.trim().split(/\s+/).length
    const readingTime = Math.ceil(words / 200)

    // Update post
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        categoryId: categoryId || null,
        featuredImageId: featuredImageId || null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        ogImage: ogImage || null,
        isFeatured,
        readingTime,
        publishedAt: status === 'PUBLISHED' && !existingPost.publishedAt ? new Date() : existingPost.publishedAt,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
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

    // Create new revision
    const latestVersion = existingPost.revisions[0]?.version || 0
    await prisma.postRevision.create({
      data: {
        postId: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        version: latestVersion + 1,
        createdBy: session.userId,
      },
    })

    // Log action in audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Post',
        entityId: post.id,
        userId: session.userId,
        description: `Updated post: ${post.title}`,
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      {
        error: 'Failed to update post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
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
  // Validar autenticação e permissões
  let session
  try {
    session = await validateAuth({
      requireRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Erro de autenticação' }, { status: 500 })
  }

  try {
    // Buscar post para audit log e verificar ownership
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: { title: true, authorId: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    // Verificar ownership para AUTHOR role (só pode deletar próprios posts)
    if (session.user.role === UserRole.AUTHOR && post.authorId !== session.userId) {
      return NextResponse.json({
        error: 'Acesso negado. Você só pode deletar seus próprios posts.'
      }, { status: 403 })
    }

    // Using soft delete by default
    await prisma.post.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    })

    // Log action in audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Post',
        entityId: params.id,
        userId: session.userId,
        description: `Deleted post: ${post.title}`,
      },
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { message: 'An error occurred while deleting the post.' },
      { status: 500 },
    )
  }
}
