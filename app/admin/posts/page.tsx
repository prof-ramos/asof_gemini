'use client'

import { useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import PageHeader from '@/components/admin/PageHeader'
import PostFilters from '@/components/admin/posts/PostFilters'
import PostList from '@/components/admin/posts/PostList'
import { AdminListFilters } from '@/types/post'

export default function AdminPostsPage() {
  const [filters, setFilters] = useState<AdminListFilters>({
    search: '',
    status: undefined,
    contentType: undefined,
    categoryId: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  return (
    <>
      <AdminHeader />
      <PageHeader
        title="Notícias"
        description="Gerencie, crie e edite as notícias do site."
        buttonLabel="Nova Notícia"
        buttonHref="/admin/posts/new"
      />
      <PostFilters
        onFiltersChange={setFilters}
      />
      <div className="px-6 pb-8">
        <PostList filters={filters} />
      </div>
    </>
  )
}
