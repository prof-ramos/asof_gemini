import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import prisma from '@/lib/prisma'
import sharp from 'sharp'
import { validateAuth, AuthError } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds for file processing

// Configuração de upload
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  VIDEO: ['video/mp4', 'video/webm', 'video/quicktime'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
}

function getMediaType(mimeType: string): 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | 'OTHER' {
  if (ALLOWED_TYPES.IMAGE.includes(mimeType)) return 'IMAGE'
  if (ALLOWED_TYPES.VIDEO.includes(mimeType)) return 'VIDEO'
  if (ALLOWED_TYPES.DOCUMENT.includes(mimeType)) return 'DOCUMENT'
  if (ALLOWED_TYPES.AUDIO.includes(mimeType)) return 'AUDIO'
  return 'OTHER'
}

export async function POST(request: NextRequest) {
  // Validar autenticação e permissões
  let session
  try {
    session = await validateAuth({
      requireRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR, UserRole.AUTHOR],
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Erro de autenticação' }, { status: 500 })
  }

  try {

    // Parse do form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validar tipo do arquivo
    const mediaType = getMediaType(file.type)
    const allAllowedTypes = [
      ...ALLOWED_TYPES.IMAGE,
      ...ALLOWED_TYPES.VIDEO,
      ...ALLOWED_TYPES.DOCUMENT,
      ...ALLOWED_TYPES.AUDIO,
    ]

    if (mediaType === 'OTHER' && !allAllowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado' },
        { status: 400 }
      )
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${extension}`

    // Upload para Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    // Processar metadados específicos
    let width: number | undefined
    let height: number | undefined
    let thumbnailUrl: string | undefined

    if (mediaType === 'IMAGE') {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const metadata = await sharp(buffer).metadata()

        width = metadata.width
        height = metadata.height

        // Gerar thumbnail (300x300)
        const thumbnail = await sharp(buffer)
          .resize(300, 300, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toBuffer()

        const thumbnailBlob = await put(
          `thumb-${fileName}`,
          thumbnail,
          {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'image/jpeg',
          }
        )

        thumbnailUrl = thumbnailBlob.url
      } catch (error) {
        console.error('Error processing image:', error)
        // Continuar mesmo se falhar o processamento
      }
    }

    // Salvar metadados no banco de dados usando userId da sessão autenticada
    const media = await prisma.media.create({
      data: {
        fileName,
        originalName: file.name,
        mimeType: file.type,
        type: mediaType,
        size: file.size,
        width,
        height,
        url: blob.url,
        thumbnailUrl,
        path: blob.pathname,
        uploaderId: session.userId,
      },
      include: {
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Registrar upload no audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Media',
        entityId: media.id,
        userId: session.userId,
        description: `Uploaded file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
      },
    })

    return NextResponse.json(
      {
        success: true,
        media,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    )
  }
}
