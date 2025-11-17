import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import PostForm from '@/components/admin/PostForm'

export const metadata: Metadata = {
  title: 'Editar Notícia - Admin ASOF',
  description: 'Editar notícia existente',
  robots: 'noindex, nofollow',
}

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params

  // Buscar post, categorias e tags
  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        category: true,
        featuredImage: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
      },
    }),
    prisma.tag.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
      },
    }),
  ])

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Editar Notícia
        </h1>
        <p className="text-gray-600 mt-1">
          Edite a notícia: {post.title}
        </p>
      </div>

      <PostForm
        mode="edit"
        post={post}
        categories={categories}
        tags={tags}
      />
    </div>
  )
}
