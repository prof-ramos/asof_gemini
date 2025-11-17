'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Save,
  Eye,
  Send,
  ArrowLeft,
  X,
  Upload,
} from 'lucide-react'
import type { PostCategory, PostTag } from '@/types'

interface PostFormData {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  publishedAt: string
  scheduledAt: string
  featuredImageId: string
  isFeatured: boolean
  categoryId: string
  tagIds: string[]
}

interface PostFormProps {
  mode: 'create' | 'edit'
  post?: any
  categories: PostCategory[]
  tags: PostTag[]
}

export default function PostForm({ mode, post, categories, tags }: PostFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(
    post?.featuredImage?.url || null
  )

  const [formData, setFormData] = useState<PostFormData>({
    id: post?.id || '',
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    status: post?.status || 'DRAFT',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    metaKeywords: post?.metaKeywords || '',
    ogImage: post?.ogImage || '',
    publishedAt: post?.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 16)
      : '',
    scheduledAt: post?.scheduledAt
      ? new Date(post.scheduledAt).toISOString().slice(0, 16)
      : '',
    featuredImageId: post?.featuredImageId || '',
    isFeatured: post?.isFeatured || false,
    categoryId: post?.categoryId || '',
    tagIds: post?.tags?.map((t: any) => t.tag.id) || [],
  })

  // Auto-gerar slug do título
  useEffect(() => {
    if (mode === 'create' && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title, mode])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }))
  }

  const handleSubmit = async (newStatus?: string) => {
    setSaving(true)

    try {
      const submitData = {
        ...formData,
        status: newStatus || formData.status,
        featuredImageId:
          formData.featuredImageId === ''
            ? null
            : formData.featuredImageId || undefined,
        categoryId:
          formData.categoryId === ''
            ? null
            : formData.categoryId || undefined,
        publishedAt:
          formData.publishedAt || newStatus === 'PUBLISHED'
            ? formData.publishedAt || new Date().toISOString()
            : undefined,
        scheduledAt: formData.scheduledAt || undefined,
      }

      const url = mode === 'create' ? '/api/posts' : `/api/posts/${formData.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao salvar notícia')
      }

      await response.json()

      // Redirecionar para listagem
      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar notícia:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar notícia. Tente novamente.'
      )
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <Link
          href="/admin/posts"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Salvar Rascunho
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('IN_REVIEW')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            Enviar para Revisão
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            <Eye className="w-5 h-5" />
            Publicar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Digite o título da notícia..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          {/* Slug */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="slug-da-noticia"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm"
            />
            <p className="text-sm text-gray-500 mt-1">
              URL: /noticias/{formData.slug || 'slug-da-noticia'}
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumo
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              placeholder="Resumo breve da notícia (para listagens)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.excerpt.length} caracteres
            </p>
          </div>

          {/* Content */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={20}
              placeholder="Escreva o conteúdo da notícia em Markdown..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none font-mono text-sm"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.content.split(/\s+/).length} palavras •{' '}
              {Math.ceil(formData.content.split(/\s+/).length / 200)} min de
              leitura
            </p>
          </div>

          {/* SEO Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-900">SEO & Metadados</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Título
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="Título para SEO (deixe vazio para usar o título principal)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Descrição
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={2}
                placeholder="Descrição para motores de busca..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavras-chave
              </label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                placeholder="palavra1, palavra2, palavra3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Publishing */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-900">Publicação</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="DRAFT">Rascunho</option>
                <option value="IN_REVIEW">Em Revisão</option>
                <option value="SCHEDULED">Agendada</option>
                <option value="PUBLISHED">Publicada</option>
              </select>
            </div>

            {formData.status === 'SCHEDULED' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agendar para
                </label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">
                Destaque na homepage
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    formData.tagIds.includes(tag.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Imagem Destacada
            </label>
            {selectedImage ? (
              <div className="relative">
                <div className="relative w-full aspect-video">
                  <Image
                    src={selectedImage}
                    alt="Imagem destacada"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null)
                    setFormData((prev) => ({ ...prev, featuredImageId: '' }))
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Clique para selecionar imagem
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
