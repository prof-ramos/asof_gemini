/**
 * API Route: Public Post Access by Slug
 *
 * GET /api/posts/by-slug/[slug] - Retrieve published post by slug (for public pages)
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

// GET /api/posts/by-slug/[slug]
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

    // Only return published posts for public access
    if (post.status !== 'PUBLISHED') {
      return NextResponse.json(
        { message: 'Post not found' },
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
