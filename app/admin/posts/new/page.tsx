import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import PostForm from '@/components/admin/PostForm'

export const metadata: Metadata = {
  title: 'Nova Notícia - Admin ASOF',
  description: 'Criar nova notícia',
  robots: 'noindex, nofollow',
}

export default async function NewPostPage() {
  // Buscar categorias e tags para o formulário
  const [categories, tags] = await Promise.all([
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Nova Notícia
        </h1>
        <p className="text-gray-600 mt-1">
          Crie uma nova notícia para o site
        </p>
      </div>

      <PostForm
        mode="create"
        categories={categories}
        tags={tags}
      />
    </div>
  )
}
