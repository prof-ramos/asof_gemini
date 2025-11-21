import { Metadata } from 'next'
import { Suspense } from 'react'
import PostForm from '@/components/admin/posts/PostForm'

export const metadata: Metadata = {
  title: 'Nova Notícia - Admin ASOF',
  description: 'Criar nova notícia',
  robots: 'noindex, nofollow',
}

function PostFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 bg-gray-200 rounded w-1/2" />
      <div className="h-96 bg-gray-200 rounded" />
    </div>
  )
}

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<PostFormSkeleton />}>
        <PostForm mode="create" />
      </Suspense>
    </div>
  )
}
