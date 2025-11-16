'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Download, Copy, CheckCircle, ExternalLink, Trash2 } from 'lucide-react'

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

interface MediaPreviewProps {
  item: MediaItem | null
  onClose: () => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, data: Partial<MediaItem>) => void
}

export default function MediaPreview({ item, onClose, onDelete, onUpdate }: MediaPreviewProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    alt: item?.alt || '',
    title: item?.title || '',
    caption: item?.caption || '',
    description: item?.description || '',
  })

  if (!item) return null

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(item.url)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(item.id, formData)
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      if (onDelete) {
        onDelete(item.id)
      }
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Detalhes do Arquivo
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <div>
                <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                  {item.type === 'IMAGE' && (
                    <Image
                      src={item.url}
                      alt={item.alt || item.originalName}
                      width={item.width || 400}
                      height={item.height || 400}
                      className="w-full h-full object-contain"
                    />
                  )}
                  {item.type === 'VIDEO' && (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full"
                    />
                  )}
                  {item.type === 'AUDIO' && (
                    <div className="w-full p-8">
                      <div className="text-center mb-4 text-6xl">🎵</div>
                      <audio src={item.url} controls className="w-full" />
                    </div>
                  )}
                  {item.type === 'DOCUMENT' && (
                    <div className="text-center">
                      <div className="text-8xl mb-4">📄</div>
                      <p className="text-gray-600">{item.mimeType}</p>
                    </div>
                  )}
                  {item.type === 'OTHER' && (
                    <div className="text-center">
                      <div className="text-8xl mb-4">📁</div>
                      <p className="text-gray-600">{item.mimeType}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copiedUrl ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copiar URL</span>
                      </>
                    )}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Abrir</span>
                  </a>
                  <a
                    href={item.url}
                    download={item.originalName}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </a>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                {/* File Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Informações do Arquivo
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Nome:</dt>
                      <dd className="text-gray-900 font-medium">{item.originalName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Tipo:</dt>
                      <dd className="text-gray-900">{item.mimeType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Tamanho:</dt>
                      <dd className="text-gray-900">{formatFileSize(item.size)}</dd>
                    </div>
                    {item.width && item.height && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Dimensões:</dt>
                        <dd className="text-gray-900">{item.width} × {item.height} px</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Enviado por:</dt>
                      <dd className="text-gray-900">{item.uploader.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Data:</dt>
                      <dd className="text-gray-900">
                        {new Date(item.createdAt).toLocaleString('pt-BR')}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Metadata Form */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Metadados
                    </h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-primary hover:text-primary-dark font-medium"
                      >
                        Editar
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            setFormData({
                              alt: item.alt || '',
                              title: item.title || '',
                              caption: item.caption || '',
                              description: item.description || '',
                            })
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSave}
                          className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                          Salvar
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Texto Alternativo (Alt)
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.alt}
                          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="Descrição para acessibilidade"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{item.alt || '—'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Título
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{item.title || '—'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Legenda
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.caption}
                          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{item.caption || '—'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      {isEditing ? (
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{item.description || '—'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                {onDelete && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir Arquivo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
