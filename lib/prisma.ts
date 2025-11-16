/**
 * Prisma Client Singleton
 *
 * This module provides a singleton instance of PrismaClient to prevent
 * creating multiple instances in development (hot reload).
 *
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],

    // Opcional: middlewares globais
    // errorFormat: 'pretty',
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

/**
 * Query Performance Middleware
 * Logs slow queries in development
 *
 * Note: Commented out until Prisma Client is generated with a valid DATABASE_URL
 */
/*
if (process.env.NODE_ENV === 'development') {
  prisma.$use(async (params: Prisma.MiddlewareParams, next) => {
    const before = Date.now()
    const result = await next(params)
    const after = Date.now()
    const duration = after - before

    // Log queries lentas (> 1 segundo)
    if (duration > 1000) {
      console.warn(
        `⚠️  SLOW QUERY (${duration}ms): ${params.model}.${params.action}`,
        JSON.stringify(params.args, null, 2)
      )
    }

    return result
  })
}
*/

/**
 * Soft Delete Middleware
 * Automaticamente filtra registros deletados (soft delete)
 *
 * Nota: Este middleware está comentado por padrão para evitar conflitos.
 * Descomente quando estiver pronto para usar soft deletes globalmente.
 */
/*
prisma.$use(async (params, next) => {
  // Para findMany, findFirst, findUnique - adiciona filtro de deletedAt
  if (params.action === 'findUnique' || params.action === 'findFirst') {
    params.action = 'findFirst'
    params.args.where = {
      ...params.args.where,
      deletedAt: null,
    }
  }

  if (params.action === 'findMany') {
    if (params.args.where) {
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null
      }
    } else {
      params.args.where = { deletedAt: null }
    }
  }

  // Para delete - converte em update (soft delete)
  if (params.action === 'delete') {
    params.action = 'update'
    params.args.data = { deletedAt: new Date() }
  }

  // Para deleteMany - converte em updateMany (soft delete)
  if (params.action === 'deleteMany') {
    params.action = 'updateMany'
    if (params.args.data !== undefined) {
      params.args.data.deletedAt = new Date()
    } else {
      params.args.data = { deletedAt: new Date() }
    }
  }

  return next(params)
})
*/
