'use client'

import { useState, useCallback } from 'react'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadedFile {
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

interface MediaUploadProps {
  onUploadComplete?: () => void
}

export default function MediaUpload({ onUploadComplete }: MediaUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }))

    setFiles(prev => [...prev, ...uploadedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const uploadFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue

      // Update status to uploading
      setFiles(prev => {
        const newFiles = [...prev]
        newFiles[i] = { ...newFiles[i], status: 'uploading' }
        return newFiles
      })

      try {
        const formData = new FormData()
        formData.append('file', files[i].file)

        // TODO: Replace with actual API endpoint
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        // Update status to success
        setFiles(prev => {
          const newFiles = [...prev]
          newFiles[i] = { ...newFiles[i], status: 'success', progress: 100 }
          return newFiles
        })
      } catch (error) {
        // Update status to error
        setFiles(prev => {
          const newFiles = [...prev]
          newFiles[i] = {
            ...newFiles[i],
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          }
          return newFiles
        })
      }
    }

    // Call callback after all uploads
    const allSuccess = files.every(f => f.status === 'success')
    if (allSuccess && onUploadComplete) {
      onUploadComplete()
      setFiles([])
    }
  }

  const clearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview))
    setFiles([])
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragging
            ? 'border-primary bg-accent/10'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Arraste arquivos aqui ou clique para selecionar
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Suporta imagens, vídeos, documentos e áudio
        </p>
        <label className="inline-block px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-dark transition-colors">
          Selecionar Arquivos
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Arquivos ({files.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Limpar Todos
              </button>
              <button
                onClick={uploadFiles}
                disabled={files.every(f => f.status !== 'pending')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {files.map((uploadedFile, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
              >
                {/* Preview */}
                {uploadedFile.file.type.startsWith('image/') ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <FileIcon type={uploadedFile.file.type} />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {uploadedFile.status === 'pending' && (
                    <span className="text-sm text-gray-500">Aguardando</span>
                  )}
                  {uploadedFile.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{uploadedFile.progress}%</span>
                    </div>
                  )}
                  {uploadedFile.status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Sucesso</span>
                    </div>
                  )}
                  {uploadedFile.status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{uploadedFile.error}</span>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('video/')) {
    return <span className="text-2xl">🎥</span>
  }
  if (type.startsWith('audio/')) {
    return <span className="text-2xl">🎵</span>
  }
  if (type.includes('pdf')) {
    return <span className="text-2xl">📄</span>
  }
  return <span className="text-2xl">📁</span>
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
