import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authToken = request.cookies.get('admin-auth-token')?.value
    if (!authToken) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Parâmetros de query
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // IMAGE, VIDEO, DOCUMENT, AUDIO, OTHER
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sort = searchParams.get('sort') || 'newest' // newest, oldest, name-asc, name-desc, size-asc, size-desc

    // Construir filtros
    const where: any = {
      deletedAt: null, // Não mostrar arquivos deletados (soft delete)
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Construir ordenação
    let orderBy: any = {}
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'name-asc':
        orderBy = { originalName: 'asc' }
        break
      case 'name-desc':
        orderBy = { originalName: 'desc' }
        break
      case 'size-asc':
        orderBy = { size: 'asc' }
        break
      case 'size-desc':
        orderBy = { size: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Buscar arquivos
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          uploader: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.media.count({ where }),
    ])

    // Estatísticas por tipo
    const stats = await prisma.media.groupBy({
      by: ['type'],
      where: { deletedAt: null },
      _count: true,
    })

    return NextResponse.json(
      {
        success: true,
        items,
        total,
        limit,
        offset,
        stats: stats.reduce((acc, stat) => {
          acc[stat.type] = stat._count
          return acc
        }, {} as Record<string, number>),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar arquivos' },
      { status: 500 }
    )
  }
}
