'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { AdminListFilters, ContentStatus, ContentType } from '@/types/post'

interface PostFiltersProps {
  onFiltersChange: (filters: AdminListFilters) => void
  isLoading?: boolean
}

const statusOptions = [
  { value: ContentStatus.DRAFT, label: 'Rascunho' },
  { value: ContentStatus.IN_REVIEW, label: 'Em Revisão' },
  { value: ContentStatus.SCHEDULED, label: 'Agendado' },
  { value: ContentStatus.PUBLISHED, label: 'Publicado' },
  { value: ContentStatus.ARCHIVED, label: 'Arquivado' },
]

const contentTypeOptions = [
  { value: ContentType.MDX, label: 'MDX' },
  { value: ContentType.DATABASE, label: 'Banco de Dados' },
]

/**
 * PostFilters component - Provides search and filtering controls for post management
 * @param onFiltersChange - Callback function called when filters change
 * @param isLoading - Whether the parent component is in loading state
 */
export default function PostFilters({ onFiltersChange, isLoading = false }: PostFiltersProps) {
  const [filters, setFilters] = useState<AdminListFilters>({
    search: '',
    status: undefined,
    contentType: undefined,
    categoryId: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  /**
   * Handles filter changes and notifies parent component
   * @param newFilters - Partial object containing new filter values
   */
  const handleFilterChange = (newFilters: Partial<AdminListFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar posts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange({ status: e.target.value as ContentStatus || undefined })}
            disabled={isLoading}
          >
            <option value="">Todos os status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Content Type Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filters.contentType || ''}
            onChange={(e) => handleFilterChange({ contentType: e.target.value as ContentType || undefined })}
            disabled={isLoading}
          >
            <option value="">Todos os tipos</option>
            {contentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
            disabled={isLoading}
          >
            <option value="createdAt">Data de criação</option>
            <option value="updatedAt">Última edição</option>
            <option value="publishedAt">Data de publicação</option>
            <option value="title">Título</option>
          </select>

          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            onClick={() => handleFilterChange({
              sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
            })}
            disabled={isLoading}
            title="Inverter ordenação"
          >
            <Filter className={`w-4 h-4 ${filters.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.status || filters.contentType) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
              Busca: &quot;{filters.search}&quot;
              <button
                onClick={() => handleFilterChange({ search: undefined })}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
              <button
                onClick={() => handleFilterChange({ status: undefined })}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.contentType && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Tipo: {contentTypeOptions.find(opt => opt.value === filters.contentType)?.label}
              <button
                onClick={() => handleFilterChange({ contentType: undefined })}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
