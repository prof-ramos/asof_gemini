import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import prisma from '@/lib/prisma'
import { UpdatePostRequest } from '@/types/post'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route' // Adjust this import based on your auth options file path

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
  request: Request,
  { params }: { params: { id: string } },
) {
  // const session = await getServerSession(authOptions)
  // if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  // }

  try {
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
        // authorId: session.user.id, // Ensure author is not changed on update unless intended
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { message: 'An error occurred while updating the post.' },
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
