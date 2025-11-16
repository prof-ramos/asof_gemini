# Database Performance & Optimization Guide

## 🎯 Overview

Este documento detalha as estratégias de otimização de performance implementadas no schema do banco de dados ASOF CMS. Inclui indexação, query optimization, caching strategies e monitoring.

## 📊 Index Strategy

### Índices Criados

#### **User Table**

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

**Justificativa:**
- `email`: Login lookup (query mais frequente)
- `role`: Filtragem por tipo de usuário em admin panel
- `status`: Filtragem de usuários ativos/inativos
- `deleted_at`: Exclusão de registros deletados (soft delete)

**Query patterns:**
```typescript
// Login - usa idx_users_email
WHERE email = ? AND deleted_at IS NULL

// Admin list - usa idx_users_role + idx_users_deleted_at
WHERE role IN ('ADMIN', 'EDITOR') AND deleted_at IS NULL

// Active users - usa idx_users_status
WHERE status = 'ACTIVE' AND deleted_at IS NULL
```

#### **Post Table**

```sql
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_is_featured ON posts(is_featured);
CREATE INDEX idx_posts_deleted_at ON posts(deleted_at);
CREATE INDEX idx_posts_fulltext ON posts USING GIN(to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content));
```

**Justificativa:**
- `slug`: URL lookup (query mais crítica para performance)
- `author_id`: Listagem de posts por autor
- `category_id`: Filtro por categoria
- `status`: Filtro de posts publicados vs rascunhos
- `published_at`: Ordenação cronológica (DESC)
- `is_featured`: Posts em destaque na homepage
- `deleted_at`: Soft delete filtering
- `fulltext`: Busca de texto completo em português

**Query patterns:**
```typescript
// Single post page - usa idx_posts_slug
WHERE slug = ? AND deleted_at IS NULL

// Homepage - usa idx_posts_status + idx_posts_published_at
WHERE status = 'PUBLISHED' AND deleted_at IS NULL
ORDER BY published_at DESC LIMIT 10

// Featured posts - usa idx_posts_is_featured + idx_posts_status
WHERE is_featured = true AND status = 'PUBLISHED' AND deleted_at IS NULL

// Author posts - usa idx_posts_author_id
WHERE author_id = ? AND deleted_at IS NULL ORDER BY created_at DESC
```

#### **Media Table**

```sql
CREATE INDEX idx_media_uploader_id ON media(uploader_id);
CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_folder_id ON media(folder_id);
CREATE INDEX idx_media_deleted_at ON media(deleted_at);
CREATE INDEX idx_media_fulltext ON media USING GIN(to_tsvector('portuguese', file_name || ' ' || COALESCE(alt, '') || ' ' || COALESCE(caption, '') || ' ' || COALESCE(title, '')));
```

**Justificativa:**
- `uploader_id`: Filtro por usuário
- `type`: Filtro por tipo (IMAGE, VIDEO, DOCUMENT)
- `folder_id`: Navegação por pastas
- `deleted_at`: Soft delete
- `fulltext`: Busca na biblioteca de mídia

#### **Category Table**

```sql
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_deleted_at ON categories(deleted_at);
```

**Justificativa:**
- `slug`: URL lookup para filtro por categoria
- `parent_id`: Hierarquia de categorias (subcategorias)
- `deleted_at`: Soft delete

#### **Comment Table**

```sql
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_deleted_at ON comments(deleted_at);
```

**Justificativa:**
- `post_id`: Carregar comentários de um post
- `user_id`: Comentários de um usuário
- `parent_id`: Respostas aninhadas
- `status`: Filtro de moderação
- `deleted_at`: Soft delete

#### **AuditLog Table**

```sql
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Justificativa:**
- `user_id`: Histórico de um usuário
- `entity_type`: Filtro por tipo de entidade
- `entity_id`: Histórico de uma entidade específica
- `action`: Filtro por tipo de ação
- `created_at`: Ordenação cronológica

### Composite Indexes

Para queries complexas frequentes:

```sql
-- Posts publicados ordenados por data
CREATE INDEX idx_posts_status_published_at ON posts(status, published_at DESC)
WHERE deleted_at IS NULL;

-- Posts de uma categoria publicados
CREATE INDEX idx_posts_category_status ON posts(category_id, status, published_at DESC)
WHERE deleted_at IS NULL;

-- Comentários aprovados de um post
CREATE INDEX idx_comments_post_status ON comments(post_id, status, created_at DESC)
WHERE deleted_at IS NULL;
```

### Partial Indexes

Índices parciais para queries específicas:

```sql
-- Apenas posts publicados (70% dos queries)
CREATE INDEX idx_posts_published_only ON posts(published_at DESC)
WHERE status = 'PUBLISHED' AND deleted_at IS NULL;

-- Apenas usuários ativos
CREATE INDEX idx_users_active_only ON users(email)
WHERE status = 'ACTIVE' AND deleted_at IS NULL;
```

## 🚀 Query Optimization

### N+1 Problem Prevention

**❌ Problema (N+1 queries):**
```typescript
// 1 query para posts + N queries para autores
const posts = await prisma.post.findMany()
for (const post of posts) {
  const author = await prisma.user.findUnique({
    where: { id: post.authorId }
  })
}
```

**✅ Solução (2 queries com include):**
```typescript
const posts = await prisma.post.findMany({
  include: {
    author: {
      select: { id: true, name: true, avatar: true }
    },
    category: {
      select: { id: true, name: true, slug: true }
    }
  }
})
```

**✅ Melhor solução (1 query com select):**
```typescript
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    publishedAt: true,
    author: {
      select: { name: true, avatar: true }
    },
    category: {
      select: { name: true, slug: true }
    }
  },
  where: {
    status: 'PUBLISHED',
    deletedAt: null
  },
  orderBy: { publishedAt: 'desc' },
  take: 10
})
```

### Pagination

**❌ Offset-based (lento para grandes datasets):**
```typescript
const posts = await prisma.post.findMany({
  skip: page * pageSize,
  take: pageSize
})
```

**✅ Cursor-based (rápido e escalável):**
```typescript
const posts = await prisma.post.findMany({
  take: pageSize,
  cursor: lastPostId ? { id: lastPostId } : undefined,
  skip: lastPostId ? 1 : 0,
  orderBy: { publishedAt: 'desc' }
})
```

### Count Optimization

**❌ Evitar count() desnecessário:**
```typescript
const total = await prisma.post.count()
const posts = await prisma.post.findMany()
```

**✅ Count apenas quando necessário:**
```typescript
// Se não precisa de total, não faça count
const posts = await prisma.post.findMany({ take: 10 })

// Se precisa, use em paralelo
const [posts, total] = await Promise.all([
  prisma.post.findMany({ take: 10 }),
  prisma.post.count({ where: { status: 'PUBLISHED' } })
])
```

### Select Only What You Need

**❌ Over-fetching:**
```typescript
const posts = await prisma.post.findMany() // Todos os campos
```

**✅ Select específico:**
```typescript
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    publishedAt: true
  }
})
```

### Batch Operations

**❌ Múltiplas queries individuais:**
```typescript
for (const postId of postIds) {
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } }
  })
}
```

**✅ Batch update:**
```typescript
await prisma.post.updateMany({
  where: { id: { in: postIds } },
  data: { viewCount: { increment: 1 } }
})
```

## 💾 Caching Strategy

### Redis Cache Layers

```typescript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedPosts(key: string, fetchFn: () => Promise<any>) {
  // Tentar buscar do cache
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }

  // Se não existe, buscar do DB
  const data = await fetchFn()

  // Armazenar no cache (1 hora)
  await redis.setex(key, 3600, JSON.stringify(data))

  return data
}

// Uso
const posts = await getCachedPosts('posts:published:latest', async () => {
  return await prisma.post.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    take: 10,
    orderBy: { publishedAt: 'desc' }
  })
})
```

### Cache Invalidation

```typescript
// app/api/admin/posts/[id]/route.ts
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Atualizar post
  const post = await prisma.post.update({
    where: { id: params.id },
    data: await req.json()
  })

  // Invalidar caches relacionados
  await redis.del('posts:published:latest')
  await redis.del(`post:${post.slug}`)
  await redis.del(`posts:category:${post.categoryId}`)

  return Response.json(post)
}
```

### Next.js ISR (Incremental Static Regeneration)

```typescript
// app/noticias/[slug]/page.tsx
export const revalidate = 60 // Revalidar a cada 60 segundos

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    select: { slug: true }
  })

  return posts.map((post) => ({
    slug: post.slug
  }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })

  return <PostContent post={post} />
}
```

### On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { path, tag } = await request.json()

  if (path) {
    revalidatePath(path)
  }

  if (tag) {
    revalidateTag(tag)
  }

  return Response.json({ revalidated: true })
}

// Após publicar post
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({ path: `/noticias/${post.slug}` })
})
```

## 🔍 Full-Text Search Optimization

### PostgreSQL Full-Text Search

```sql
-- Criar índice GIN para busca em português
CREATE INDEX idx_posts_search ON posts
USING GIN(to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content));
```

**Query exemplo:**
```typescript
const searchResults = await prisma.$queryRaw`
  SELECT id, title, slug, excerpt,
         ts_rank(to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content),
                 to_tsquery('portuguese', ${searchTerm})) as rank
  FROM posts
  WHERE to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content) @@ to_tsquery('portuguese', ${searchTerm})
    AND status = 'PUBLISHED'
    AND deleted_at IS NULL
  ORDER BY rank DESC
  LIMIT 20
`
```

### Search com Prisma Preview Feature

```typescript
// Habilitar no schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}

// Uso
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { search: searchTerm } },
      { content: { search: searchTerm } }
    ],
    status: 'PUBLISHED',
    deletedAt: null
  },
  orderBy: {
    _relevance: {
      fields: ['title', 'content'],
      search: searchTerm,
      sort: 'desc'
    }
  }
})
```

## 📊 Connection Pooling

### Prisma Client Configuration

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],

    // Connection pool configuration
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Connection Pool Settings

```env
# .env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=10&pool_timeout=30"
```

**Recomendações:**
- **Development**: connection_limit=10
- **Production**: connection_limit=100 (ajustar conforme carga)
- **Serverless**: Usar Prisma Accelerate ou connection pooler (PgBouncer)

## 🎯 Performance Monitoring

### Query Performance Monitoring

```typescript
// middleware.ts
import { prisma } from '@/lib/prisma'

prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)

  // Alert em queries lentas (> 1s)
  if (after - before > 1000) {
    console.warn(`SLOW QUERY: ${params.model}.${params.action}`, params.args)
  }

  return result
})
```

### Database Metrics

```typescript
// app/api/admin/metrics/route.ts
export async function GET() {
  const metrics = {
    totalPosts: await prisma.post.count(),
    publishedPosts: await prisma.post.count({
      where: { status: 'PUBLISHED' }
    }),
    totalUsers: await prisma.user.count(),
    activeUsers: await prisma.user.count({
      where: { status: 'ACTIVE' }
    }),
    totalMedia: await prisma.media.count(),
    mediaSize: await prisma.media.aggregate({
      _sum: { size: true }
    }),
    pageViews: await prisma.pageView.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
        }
      }
    })
  }

  return Response.json(metrics)
}
```

### PostgreSQL Query Analysis

```sql
-- Ver queries mais lentas
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Análise de índices não utilizados
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY tablename;

-- Tamanho das tabelas
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🔧 Database Optimization Checklist

### Pre-Production

- [ ] Todos os índices necessários criados
- [ ] Full-text search configurado para português
- [ ] Connection pooling configurado
- [ ] Soft deletes implementados
- [ ] Audit logging configurado
- [ ] Backup automático configurado

### Production

- [ ] Query monitoring ativado
- [ ] Slow query alerts configurados
- [ ] Cache layers implementadas (Redis)
- [ ] CDN configurado para assets
- [ ] Database read replicas (se necessário)
- [ ] Regular VACUUM e ANALYZE

### Ongoing

- [ ] Monitorar índices não utilizados
- [ ] Analisar queries lentas semanalmente
- [ ] Revisar estratégia de cache mensalmente
- [ ] Limpar soft deletes antigos (6+ meses)
- [ ] Otimizar tabelas grandes (partitioning)

## 📈 Performance Targets

### Query Performance
- **Single post lookup**: < 50ms
- **Homepage feed**: < 100ms
- **Search results**: < 200ms
- **Admin dashboard**: < 300ms

### Database
- **Connection time**: < 10ms
- **Query execution**: < 100ms (p95)
- **Transaction time**: < 200ms

### Caching
- **Cache hit rate**: > 80%
- **Redis latency**: < 5ms
- **ISR revalidation**: 60s

## 🚀 Scaling Strategy

### Vertical Scaling
1. Aumentar recursos do servidor PostgreSQL
2. Otimizar configurações do PostgreSQL (shared_buffers, work_mem)
3. SSD/NVMe storage

### Horizontal Scaling
1. **Read replicas** para queries read-heavy
2. **PgBouncer** para connection pooling
3. **Prisma Accelerate** para edge caching

### Sharding (Future)
- Por tenant (se multi-tenant)
- Por data (posts por ano)
- Geographic sharding

---

**Última atualização**: 2024-11-16
**Versão**: 1.0.0
