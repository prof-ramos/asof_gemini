'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MoreVertical, Download, Trash2, Eye, Copy, CheckCircle } from 'lucide-react'

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
  createdAt: string
  uploader: {
    name: string
  }
}

interface MediaGridProps {
  items: MediaItem[]
  onDelete?: (id: string) => void
  onSelect?: (item: MediaItem) => void
}

export default function MediaGrid({ items, onDelete, onSelect }: MediaGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleCopyUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedUrl(id)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelect?.(item)}
        >
          {/* Media Preview */}
          <div className="aspect-square bg-gray-100 relative">
            {item.type === 'IMAGE' && (
              <Image
                src={item.thumbnailUrl || item.url}
                alt={item.originalName}
                fill
                className="object-cover"
              />
            )}
            {item.type === 'VIDEO' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🎥</span>
              </div>
            )}
            {item.type === 'AUDIO' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🎵</span>
              </div>
            )}
            {item.type === 'DOCUMENT' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">📄</span>
              </div>
            )}
            {item.type === 'OTHER' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">📁</span>
              </div>
            )}

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(item.url, '_blank')
                }}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                title="Visualizar"
              >
                <Eye className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyUrl(item.url, item.id)
                }}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                title="Copiar URL"
              >
                {copiedUrl === item.id ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <a
                href={item.url}
                download={item.originalName}
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </a>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
                      onDelete(item.id)
                    }
                  }}
                  className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="font-medium text-sm text-gray-900 truncate" title={item.originalName}>
              {item.originalName}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {formatFileSize(item.size)}
              </span>
              {item.width && item.height && (
                <span className="text-xs text-gray-500">
                  {item.width} × {item.height}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-400">
                {item.uploader.name}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="col-span-full py-12 text-center">
          <p className="text-gray-500">Nenhum arquivo encontrado</p>
        </div>
      )}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays}d atrás`

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
