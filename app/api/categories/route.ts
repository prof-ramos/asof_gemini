/**
 * API Route: Categories
 *
 * GET /api/categories - Lista todas as categorias
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeCount = searchParams.get('includeCount') === 'true'

    const categories = await prisma.category.findMany({
      where: {
        isVisible: true,
        deletedAt: null,
      },
      include: {
        _count: includeCount ? {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
                deletedAt: null,
              },
            },
          },
        } : false,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    )
  }
}
