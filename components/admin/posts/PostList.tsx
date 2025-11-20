'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  FileText,
  Database,
  AlertCircle
} from 'lucide-react'
import { AdminListFilters, DatabasePost, ContentStatus, ContentType } from '@/types/post'

interface PostListProps {
  filters: AdminListFilters
}

const statusConfig = {
  [ContentStatus.DRAFT]: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800' },
  [ContentStatus.IN_REVIEW]: { label: 'Em Revisão', color: 'bg-yellow-100 text-yellow-800' },
  [ContentStatus.SCHEDULED]: { label: 'Agendado', color: 'bg-blue-100 text-blue-800' },
  [ContentStatus.PUBLISHED]: { label: 'Publicado', color: 'bg-green-100 text-green-800' },
  [ContentStatus.ARCHIVED]: { label: 'Arquivado', color: 'bg-purple-100 text-purple-800' },
  [ContentStatus.DELETED]: { label: 'Excluído', color: 'bg-red-100 text-red-800' },
}

interface ExtendedPost extends DatabasePost {
  author: { name: string }
  category?: { name: string; slug: string }
}

/**
 * PostList component - Displays a table of posts with actions and status information
 * @param filters - Current filter state to re-fetch posts when changed
 */
export default function PostList({ filters }: PostListProps) {
  const [posts, setPosts] = useState<ExtendedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.contentType) params.append('contentType', filters.contentType)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

      const response = await fetch(`/api/posts/admin?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch posts')
      }

      setPosts(result.data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
      return
    }

    setDeletingId(postId)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Failed to delete post')
      }

      // Remove post from list
      setPosts(posts.filter(post => post.id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Erro ao excluir o post. Tente novamente.')
    } finally {
      setDeletingId(null)
    }
  }

  const getContentTypeIcon = (contentType: ContentType) => {
    return contentType === ContentType.MDX ? (
      <FileText className="w-4 h-4" />
    ) : (
      <Database className="w-4 h-4" />
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-red-800 font-medium">Erro ao carregar posts</h3>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={fetchPosts}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg p-6">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum post encontrado</h3>
        <p className="text-gray-600 mb-6">Comece criando seu primeiro post.</p>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Criar primeiro post
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Post
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Autor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-3 w-3">
                    {post.isFeatured && (
                      <div className="h-3 w-3 bg-yellow-500 rounded-full" title="Destaque"></div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      {post.category && (
                        <>
                          <Tag className="w-3 h-3" />
                          {post.category.name}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[post.status].color}`}>
                  {statusConfig[post.status].label}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-600">
                  {getContentTypeIcon(ContentType.DATABASE)}
                  <span className="ml-2">Banco de Dados</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  {post.author.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    {post.publishedAt ? (
                      <>
                        <div>Publicado: {format(new Date(post.publishedAt), 'dd/MM/yyyy', { locale: ptBR })}</div>
                        <div className="text-xs">Criado: {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</div>
                      </>
                    ) : (
                      <div>Criado: {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {post.status === ContentStatus.PUBLISHED && (
                    <Link
                      href={`/noticias/${post.slug}`}
                      className="text-gray-600 hover:text-gray-900"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    title="Excluir"
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
  )
}
