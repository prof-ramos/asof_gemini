'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'
import type { PostAuthor, PostCategory } from '@/types'
import { formatDate } from '@/lib/utils'

interface PostWithRelations {
  id: string
  slug: string
  title: string
  excerpt: string | null
  status: string
  publishedAt: Date | null
  viewCount: number
  readingTime: number | null
  createdAt: Date
  updatedAt: Date
  author: PostAuthor
  category: PostCategory | null
  featuredImage: {
    url: string
    alt: string | null
  } | null
}

interface PostsTableProps {
  posts: PostWithRelations[]
}

export default function PostsTable({ posts }: PostsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta notícia?')) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar post')
      }

      // Recarregar página para atualizar lista
      window.location.reload()
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      alert('Erro ao deletar notícia. Tente novamente.')
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      DRAFT: 'bg-gray-100 text-gray-800',
      IN_REVIEW: 'bg-yellow-100 text-yellow-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-purple-100 text-purple-800',
      DELETED: 'bg-red-100 text-red-800',
    }

    const labels = {
      DRAFT: 'Rascunho',
      IN_REVIEW: 'Em Revisão',
      SCHEDULED: 'Agendada',
      PUBLISHED: 'Publicada',
      ARCHIVED: 'Arquivada',
      DELETED: 'Deletada',
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          badges[status as keyof typeof badges] || badges.DRAFT
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500 mb-4">Nenhuma notícia encontrada</p>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Criar primeira notícia
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notícia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visualizações
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {post.featuredImage && (
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt || post.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-medium text-gray-900 hover:text-primary line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.category ? (
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: post.category.color
                          ? `${post.category.color}20`
                          : '#f3f4f6',
                        color: post.category.color || '#374151',
                      }}
                    >
                      {post.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Sem categoria</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{post.author.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(post.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.publishedAt
                    ? formatDate(post.publishedAt.toString())
                    : formatDate(post.createdAt.toString())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    {post.viewCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {post.status === 'PUBLISHED' && (
                      <Link
                        href={`/noticias/${post.slug}`}
                        target="_blank"
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                        title="Ver notícia"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
