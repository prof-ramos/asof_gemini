'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import slugify from 'slugify'
import { toast } from 'sonner'
import {
  Save,
  Eye,
  Upload,
  X,
  Calendar,
  Tag,
  Folder,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react'
import Image from 'next/image'

// Dynamic import of markdown editor (client-side only)
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg p-4 h-96 flex items-center justify-center">
      <p className="text-gray-500">Carregando editor...</p>
    </div>
  ),
})

// Form validation schema
const postSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  excerpt: z.string().max(500, 'Resumo muito longo').optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  categoryId: z.string().optional(),
  featuredImageId: z.string().optional(),
  metaTitle: z.string().max(60, 'Meta título muito longo (máx. 60 caracteres)').optional(),
  metaDescription: z.string().max(160, 'Meta descrição muito longa (máx. 160 caracteres)').optional(),
  ogImage: z.string().url('URL inválida').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  scheduledAt: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

interface PostFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<PostFormData>
  postId?: string
  onSave?: (data: PostFormData) => void | Promise<void>
}

interface Category {
  id: string
  name: string
}

export default function PostForm({ mode, initialData, postId, onSave }: PostFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredImage, setFeaturedImage] = useState<string | null>(initialData?.ogImage || null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      categoryId: '',
      metaTitle: '',
      metaDescription: '',
      ogImage: '',
      isFeatured: false,
      scheduledAt: '',
      ...initialData,
    },
  })

  const titleValue = watch('title')
  const contentValue = watch('content')

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && titleValue && !initialData?.slug) {
      const generatedSlug = slugify(titleValue, {
        lower: true,
        strict: true,
        locale: 'pt',
      })
      setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [titleValue, mode, initialData, setValue])

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Autosave draft every 30 seconds
  useEffect(() => {
    if (mode === 'edit' && isDirty) {
      const interval = setInterval(() => {
        handleSubmit((data) => saveDraft(data))()
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [mode, isDirty, handleSubmit])

  // Save as draft
  const saveDraft = async (data: PostFormData) => {
    setIsSaving(true)
    try {
      const endpoint = mode === 'create' ? '/api/posts' : `/api/posts/${postId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          status: 'DRAFT',
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar rascunho')
      }

      const result = await response.json()
      setLastSaved(new Date())
      toast.success('Rascunho salvo automaticamente')

      if (mode === 'create' && result.post?.id) {
        // Redirect to edit mode after first save
        router.push(`/admin/posts/${result.post.id}/edit`)
      }

      if (onSave) {
        await onSave(data)
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Erro ao salvar rascunho')
    } finally {
      setIsSaving(false)
    }
  }

  // Publish post
  const publishPost = async (data: PostFormData) => {
    setIsPublishing(true)
    try {
      const endpoint = mode === 'create' ? '/api/posts' : `/api/posts/${postId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao publicar')
      }

      toast.success('Notícia publicada com sucesso!')
      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error('Error publishing:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao publicar')
    } finally {
      setIsPublishing(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Erro ao fazer upload da imagem')
      return null
    }
  }

  // Calculate reading time
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  return (
    <form onSubmit={handleSubmit(publishPost)} className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between sticky top-0 bg-neutral py-4 z-10">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            {mode === 'create' ? 'Nova Notícia' : 'Editar Notícia'}
          </h2>
          {lastSaved && (
            <p className="text-sm text-gray-500 mt-1">
              Último salvamento: {lastSaved.toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Editar' : 'Visualizar'}
          </button>

          <button
            type="button"
            onClick={handleSubmit(saveDraft)}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </button>

          <button
            type="submit"
            disabled={isPublishing}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Digite o título da notícia"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
              placeholder="titulo-da-noticia"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.slug.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              URL: /noticias/{watch('slug') || 'titulo-da-noticia'}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Resumo
            </label>
            <textarea
              id="excerpt"
              {...register('excerpt')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Breve resumo da notícia (usado em listagens e compartilhamento)"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {watch('excerpt')?.length || 0}/500 caracteres
            </p>
          </div>

          {/* Content (Markdown Editor) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo *
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <div data-color-mode="light">
                  <MDEditor
                    value={field.value}
                    onChange={(value) => field.onChange(value || '')}
                    height={500}
                    preview={showPreview ? 'preview' : 'live'}
                    hideToolbar={showPreview}
                  />
                </div>
              )}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.content.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Tempo de leitura estimado: {calculateReadingTime(contentValue || '')} min
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
              <Folder className="w-4 h-4" />
              Categoria
            </h3>
            <select
              {...register('categoryId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
              <ImageIcon className="w-4 h-4" />
              Imagem Destacada
            </h3>
            {featuredImage ? (
              <div className="relative">
                <Image
                  src={featuredImage}
                  alt="Imagem destacada"
                  width={300}
                  height={200}
                  className="rounded-lg w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImage(null)
                    setValue('ogImage', '')
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  {...register('ogImage')}
                  placeholder="URL da imagem"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm mb-2"
                  onChange={(e) => setFeaturedImage(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Cole a URL da imagem ou faça upload
                </p>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
              <Tag className="w-4 h-4" />
              Configurações
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isFeatured')}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Notícia em destaque</span>
              </label>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Agendar publicação
                </label>
                <input
                  type="datetime-local"
                  {...register('scheduledAt')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Meta Título
                </label>
                <input
                  type="text"
                  {...register('metaTitle')}
                  placeholder={watch('title')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {watch('metaTitle')?.length || 0}/60 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Meta Descrição
                </label>
                <textarea
                  {...register('metaDescription')}
                  placeholder={watch('excerpt')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {watch('metaDescription')?.length || 0}/160 caracteres
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
