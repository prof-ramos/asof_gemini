/**
 * API Route: Post Individual
 *
 * GET /api/posts/[slug] - Busca post por slug
 * PUT /api/posts/[slug] - Atualiza post (requer autenticação)
 * DELETE /api/posts/[slug] - Soft delete de post (requer autenticação)
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

// GET /api/posts/[slug]
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
            icon: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            url: true,
            alt: true,
            caption: true,
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
        relatedPosts: {
          include: {
            toPost: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                publishedAt: true,
                category: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
          take: 3,
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
        },
        { status: 404 }
      )
    }

    // Incrementar view count
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })

    // Formatar resposta
    const formattedPost = {
      ...post,
      tags: post.tags.map(pt => pt.tag),
      relatedPosts: post.relatedPosts.map(rp => rp.toPost),
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
        error: 'Failed to fetch post',
      },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[slug] - Atualizar post
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params
    const body = await request.json()

    // TODO: Adicionar autenticação
    // const session = await getServerSession()
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const post = await prisma.post.update({
      where: { slug },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        author: true,
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update post',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[slug] - Soft delete
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    // TODO: Adicionar autenticação
    // const session = await getServerSession()
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Soft delete
    await prisma.post.update({
      where: { slug },
      data: {
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete post',
      },
      { status: 500 }
    )
  }
}
