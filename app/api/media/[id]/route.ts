import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET - Buscar arquivo específico
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!media || media.deletedAt) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        media,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar arquivo' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar metadados
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verificar autenticação
    const authToken = request.cookies.get('admin-auth-token')?.value
    if (!authToken) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Campos permitidos para atualização
    const allowedFields = ['alt', 'caption', 'title', 'description']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido para atualizar' },
        { status: 400 }
      )
    }

    // Atualizar no banco
    const media = await prisma.media.update({
      where: { id },
      data: updateData,
      include: {
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        media,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating media:', error)

    // Verificar se o arquivo existe
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar arquivo' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar arquivo
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verificar autenticação
    const authToken = request.cookies.get('admin-auth-token')?.value
    if (!authToken) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Buscar arquivo
    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media || media.deletedAt) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Deletar do Vercel Blob
    try {
      await del(media.url)

      // Deletar thumbnail se existir
      if (media.thumbnailUrl) {
        await del(media.thumbnailUrl)
      }
    } catch (error) {
      console.error('Error deleting from Vercel Blob:', error)
      // Continuar mesmo se falhar a deleção do Blob
    }

    // Soft delete no banco (marcar como deletado)
    await prisma.media.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })

    // Ou hard delete (remover completamente):
    // await prisma.media.delete({ where: { id } })

    return NextResponse.json(
      {
        success: true,
        message: 'Arquivo deletado com sucesso',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting media:', error)

    // Verificar se o arquivo existe
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao deletar arquivo' },
      { status: 500 }
    )
  }
}
