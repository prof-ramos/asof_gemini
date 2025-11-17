import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'

import prisma from '@/lib/prisma'
import { AdminListFilters } from '@/types/post'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET /api/posts/admin - Retrieve posts for admin panel with filtering and pagination
 * @param request - The incoming HTTP request containing query parameters
 * @returns Response with filtered and paginated posts data or error response
 */
export async function GET(request: Request) {
  // const session = await getServerSession(authOptions)
  // if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  // }

  try {
    const { searchParams } = new URL(request.url)
    const filters: AdminListFilters = Object.fromEntries(searchParams.entries())

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
      categoryId,
    } = filters

    const where: Prisma.PostWhereInput = {
      deletedAt: null, // Exclude soft-deleted posts
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const total = await prisma.post.count({ where })
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    return NextResponse.json({
      data: posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    console.error('Error fetching admin posts:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching posts.' },
      { status: 500 },
    )
  }
}
