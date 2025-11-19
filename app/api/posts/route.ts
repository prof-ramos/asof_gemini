import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Prisma } from '@prisma/client'
import slugify from 'slugify'

import prisma from '@/lib/prisma'

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
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authToken = cookies().get('admin-auth-token')
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get session and verify user
    const session = await prisma.session.findUnique({
      where: { sessionToken: authToken.value },
      include: { user: true },
    })

    if (!session || session.expires < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const {
      title,
      slug: providedSlug,
      excerpt,
      content,
      status = 'DRAFT',
      categoryId,
      featuredImageId,
      metaTitle,
      metaDescription,
      ogImage,
      isFeatured = false,
      scheduledAt,
    } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    let slug = providedSlug
    if (!slug) {
      slug = slugify(title, {
        lower: true,
        strict: true,
        locale: 'pt',
      })
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      // Append timestamp to make it unique
      slug = `${slug}-${Date.now()}`
    }

    // Calculate reading time (200 words per minute)
    const words = content.trim().split(/\s+/).length
    const readingTime = Math.ceil(words / 200)

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        authorId: session.user.id,
        categoryId: categoryId || null,
        featuredImageId: featuredImageId || null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        ogImage: ogImage || null,
        isFeatured,
        readingTime,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
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

    // Create initial revision
    await prisma.postRevision.create({
      data: {
        postId: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        version: 1,
        createdBy: session.user.id,
      },
    })

    // Log action in audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Post',
        entityId: post.id,
        userId: session.user.id,
        description: `Created post: ${post.title}`,
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        error: 'Failed to create post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
