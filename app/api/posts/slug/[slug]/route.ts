/**
 * API Route: Posts por Slug
 *
 * GET /api/posts/slug/[slug] - Busca post por slug
 *
 * Endpoint público para buscar posts publicados por slug
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ContentStatus } from '@prisma/client'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

// GET /api/posts/slug/[slug] - Buscar post por slug
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    const post = await prisma.post.findUnique({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            description: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            url: true,
            alt: true,
            width: true,
            height: true,
            caption: true,
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

    // Apenas posts publicados são retornados por este endpoint público
    // (posts em rascunho ou revisão só via endpoint autenticado)
    if (post.status !== ContentStatus.PUBLISHED) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post não está publicado',
        },
        { status: 404 }
      )
    }

    // Incrementar contador de visualizações
    await prisma.post.update({
      where: { id: post.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    // Transformar tags para formato simplificado
    const formattedPost = {
      ...post,
      tags: post.tags.map(pt => pt.tag),
    }

    // Buscar posts relacionados (mesma categoria, excluindo o atual)
    const relatedPosts = await prisma.post.findMany({
      where: {
        categoryId: post.categoryId,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
        id: {
          not: post.id,
        },
      },
      take: 3,
      orderBy: {
        publishedAt: 'desc',
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        readingTime: true,
        featuredImage: {
          select: {
            url: true,
            alt: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        post: formattedPost,
        relatedPosts,
      },
    })
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar post',
      },
      { status: 500 }
    )
  }
}
