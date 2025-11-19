import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

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

    // For non-published posts, check session
    // const session = await getServerSession(authOptions)
    // if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    // }

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
        createdBy: session.user.id,
      },
    })

    // Log action in audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Post',
        entityId: post.id,
        userId: session.user.id,
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
  // const session = await getServerSession(authOptions)
  // if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  // }

  try {
    // Using soft delete by default
    await prisma.post.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
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
