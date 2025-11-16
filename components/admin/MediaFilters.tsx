'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

interface MediaFiltersProps {
  onSearchChange: (search: string) => void
  onTypeChange: (type: string) => void
  onSortChange: (sort: string) => void
}

export default function MediaFilters({
  onSearchChange,
  onTypeChange,
  onSortChange,
}: MediaFiltersProps) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    onTypeChange(value)
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    onSortChange(value)
  }

  const clearFilters = () => {
    setSearch('')
    setType('all')
    setSort('newest')
    onSearchChange('')
    onTypeChange('all')
    onSortChange('newest')
  }

  const hasActiveFilters = search !== '' || type !== 'all' || sort !== 'newest'

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome do arquivo..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors
            ${showFilters
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <Filter className="w-5 h-5" />
          Filtros
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Arquivo
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">Todos os tipos</option>
                <option value="IMAGE">Imagens</option>
                <option value="VIDEO">Vídeos</option>
                <option value="DOCUMENT">Documentos</option>
                <option value="AUDIO">Áudio</option>
                <option value="OTHER">Outros</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="newest">Mais recente</option>
                <option value="oldest">Mais antigo</option>
                <option value="name-asc">Nome (A-Z)</option>
                <option value="name-desc">Nome (Z-A)</option>
                <option value="size-asc">Menor tamanho</option>
                <option value="size-desc">Maior tamanho</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {hasActiveFilters ? 'Filtros ativos' : 'Nenhum filtro aplicado'}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Limpar todos
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
