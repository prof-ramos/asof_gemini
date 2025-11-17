/**
 * API Route: Posts Individual
 *
 * GET /api/posts/[id] - Busca post por ID
 * PUT /api/posts/[id] - Atualiza post (requer autenticação)
 * DELETE /api/posts/[id] - Deleta post (soft delete - requer autenticação)
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ContentStatus, UserRole } from '@prisma/client'
import {
  requireAuth,
  canEditPost,
  canDeletePost,
} from '@/lib/auth-helpers'
import type { UpdatePostInput } from '@/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/posts/[id] - Buscar post por ID (protegido - apenas autenticado)
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Verificar autenticação (admin apenas)
    const authResult = await requireAuth(request)
    if ('error' in authResult) {
      return authResult.error
    }

    const post = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
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
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post não encontrado',
        },
        { status: 404 }
      )
    }

    // Transformar tags para formato simplificado
    const formattedPost = {
      ...post,
      tags: post.tags.map(pt => pt.tag),
    }

    return NextResponse.json({
      success: true,
      data: formattedPost,
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar post',
      },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Atualizar post
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Verificar autenticação
    const authResult = await requireAuth(request)
    if ('error' in authResult) {
      return authResult.error
    }

    const { session } = authResult

    // Buscar post existente
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post não encontrado',
        },
        { status: 404 }
      )
    }

    // Verificar permissão de edição
    if (!canEditPost(session, existingPost.authorId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Você não tem permissão para editar este post',
        },
        { status: 403 }
      )
    }

    const body: UpdatePostInput = await request.json()
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

    // Calcular reading time se conteúdo foi atualizado
    const readingTime = content
      ? Math.ceil(content.split(/\s+/).length / 200)
      : undefined

    // Atualizar post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(status && { status }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(metaKeywords !== undefined && { metaKeywords }),
        ...(ogImage !== undefined && { ogImage }),
        ...(publishedAt !== undefined && {
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        }),
        ...(scheduledAt !== undefined && {
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        }),
        ...(featuredImageId !== undefined && { featuredImageId }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(categoryId !== undefined && { categoryId }),
        ...(readingTime !== undefined && { readingTime }),
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

    // Atualizar tags se fornecidas
    if (tagIds !== undefined) {
      // Remover tags antigas
      await prisma.postTag.deleteMany({
        where: { postId: id },
      })

      // Adicionar novas tags
      if (tagIds.length > 0) {
        await prisma.postTag.createMany({
          data: tagIds.map((tagId: string) => ({
            postId: id,
            tagId,
          })),
        })
      }
    }

    // Registrar no audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Post',
        entityId: id,
        userId: session.user.id,
        description: `Post atualizado: ${updatedPost.title}`,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedPost,
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao atualizar post',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - Deletar post (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Verificar autenticação
    const authResult = await requireAuth(request)
    if ('error' in authResult) {
      return authResult.error
    }

    const { session } = authResult

    // Verificar permissão de deleção
    if (!canDeletePost(session)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Você não tem permissão para deletar posts',
        },
        { status: 403 }
      )
    }

    // Buscar post
    const post = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post não encontrado',
        },
        { status: 404 }
      )
    }

    // Soft delete
    await prisma.post.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: ContentStatus.DELETED,
      },
    })

    // Registrar no audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Post',
        entityId: id,
        userId: session.user.id,
        description: `Post deletado: ${post.title}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Post deletado com sucesso',
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao deletar post',
      },
      { status: 500 }
    )
  }
}
