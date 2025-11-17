'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Image as ImageIcon } from 'lucide-react'
import MediaUpload from '@/components/admin/MediaUpload'
import MediaGrid from '@/components/admin/MediaGrid'
import MediaFilters from '@/components/admin/MediaFilters'
import MediaPreview from '@/components/admin/MediaPreview'

interface MediaItem {
  id: string
  fileName: string
  originalName: string
  url: string
  thumbnailUrl?: string
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | 'OTHER'
  size: number
  width?: number
  height?: number
  mimeType: string
  alt?: string
  caption?: string
  title?: string
  description?: string
  createdAt: string
  uploader: {
    name: string
    email: string
  }
}

export default function MediaPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    sort: 'newest',
  })

  // Fetch media items
  useEffect(() => {
    fetchMediaItems()
  }, [])

  const fetchMediaItems = async () => {
    setLoading(true)
    try {
      // Fetch media from API endpoint
      const response = await fetch('/api/media')

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `API Error: ${response.status}`)
      }

      const data = await response.json()
      setMediaItems(data.items || [])
    } catch (error) {
      console.error('Error fetching media:', error)
      // Show empty state or error message instead of silently using mock data
      setMediaItems([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = [...mediaItems]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.originalName.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'name-asc':
          return a.originalName.localeCompare(b.originalName)
        case 'name-desc':
          return b.originalName.localeCompare(a.originalName)
        case 'size-asc':
          return a.size - b.size
        case 'size-desc':
          return b.size - a.size
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }, [mediaItems, filters])

  // Apply filters
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMediaItems(prev => prev.filter(item => item.id !== id))
        setSelectedItem(null)
      }
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  const handleUpdate = async (id: string, data: Partial<MediaItem>) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setMediaItems(prev =>
          prev.map(item => (item.id === id ? { ...item, ...data } : item))
        )
      }
    } catch (error) {
      console.error('Error updating media:', error)
    }
  }

  const handleUploadComplete = () => {
    fetchMediaItems()
    setShowUpload(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Biblioteca de Mídia
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie imagens, vídeos e documentos
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Upload
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Arquivos</p>
              <p className="text-2xl font-bold text-gray-900">{mediaItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🖼️</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Imagens</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaItems.filter(i => i.type === 'IMAGE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎥</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vídeos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaItems.filter(i => i.type === 'VIDEO').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Documentos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaItems.filter(i => i.type === 'DOCUMENT').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upload de Arquivos
          </h2>
          <MediaUpload onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {/* Filters */}
      <MediaFilters
        onSearchChange={(search) => setFilters({ ...filters, search })}
        onTypeChange={(type) => setFilters({ ...filters, type })}
        onSortChange={(sort) => setFilters({ ...filters, sort })}
      />

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Carregando...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Mostrando {filteredItems.length} de {mediaItems.length} arquivos
            </p>
          </div>
          <MediaGrid
            items={filteredItems}
            onDelete={handleDelete}
            onSelect={setSelectedItem}
          />
        </div>
      )}

      {/* Preview Modal */}
      <MediaPreview
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
