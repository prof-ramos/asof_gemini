import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import prisma from '@/lib/prisma'
import PostsTable from '@/components/admin/PostsTable'
import { ContentStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Notícias - Admin ASOF',
  description: 'Gerenciar notícias do site ASOF',
  robots: 'noindex, nofollow',
}

interface SearchParams {
  searchParams: Promise<{
    page?: string
    status?: string
    search?: string
  }>
}

export default async function PostsAdminPage({ searchParams }: SearchParams) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const status = params.status as ContentStatus | undefined
  const search = params.search || ''
  const limit = 20

  // Construir filtros
  const where: any = {
    deletedAt: null,
  }

  if (status) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Buscar posts
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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
            url: true,
            alt: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  // Contar por status
  const statusCounts = await prisma.post.groupBy({
    by: ['status'],
    where: { deletedAt: null },
    _count: true,
  })

  const countsByStatus = statusCounts.reduce(
    (acc, item) => {
      acc[item.status] = item._count
      return acc
    },
    {} as Record<string, number>
  )

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Notícias
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie as notícias e artigos do site
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Notícia
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Link
          href="/admin/posts"
          className={`bg-white p-4 rounded-lg border ${
            !status ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          } hover:shadow-md transition-shadow`}
        >
          <p className="text-sm text-gray-600">Todas</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </Link>
        <Link
          href="/admin/posts?status=DRAFT"
          className={`bg-white p-4 rounded-lg border ${
            status === 'DRAFT' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          } hover:shadow-md transition-shadow`}
        >
          <p className="text-sm text-gray-600">Rascunhos</p>
          <p className="text-2xl font-bold text-gray-900">
            {countsByStatus.DRAFT || 0}
          </p>
        </Link>
        <Link
          href="/admin/posts?status=IN_REVIEW"
          className={`bg-white p-4 rounded-lg border ${
            status === 'IN_REVIEW' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          } hover:shadow-md transition-shadow`}
        >
          <p className="text-sm text-gray-600">Em Revisão</p>
          <p className="text-2xl font-bold text-gray-900">
            {countsByStatus.IN_REVIEW || 0}
          </p>
        </Link>
        <Link
          href="/admin/posts?status=PUBLISHED"
          className={`bg-white p-4 rounded-lg border ${
            status === 'PUBLISHED' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          } hover:shadow-md transition-shadow`}
        >
          <p className="text-sm text-gray-600">Publicadas</p>
          <p className="text-2xl font-bold text-green-600">
            {countsByStatus.PUBLISHED || 0}
          </p>
        </Link>
        <Link
          href="/admin/posts?status=SCHEDULED"
          className={`bg-white p-4 rounded-lg border ${
            status === 'SCHEDULED' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
          } hover:shadow-md transition-shadow`}
        >
          <p className="text-sm text-gray-600">Agendadas</p>
          <p className="text-2xl font-bold text-blue-600">
            {countsByStatus.SCHEDULED || 0}
          </p>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título ou conteúdo..."
              defaultValue={search}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <PostsTable posts={posts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, total)} de{' '}
            {total} resultados
          </div>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/posts?page=${page - 1}${status ? `&status=${status}` : ''}${
                  search ? `&search=${search}` : ''
                }`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/posts?page=${page + 1}${status ? `&status=${status}` : ''}${
                  search ? `&search=${search}` : ''
                }`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Próxima
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
