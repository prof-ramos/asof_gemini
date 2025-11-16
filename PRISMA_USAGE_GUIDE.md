# 📘 Guia de Uso do Prisma - ASOF CMS

## 🎯 Visão Geral

Este guia mostra como usar o Prisma Client no projeto ASOF para interagir com o banco de dados.

---

## 📚 Índice

1. [Importar Prisma Client](#1-importar-prisma-client)
2. [Operações CRUD Básicas](#2-operações-crud-básicas)
3. [Queries Avançadas](#3-queries-avançadas)
4. [Server Components](#4-server-components-nextjs-15)
5. [API Routes](#5-api-routes)
6. [Server Actions](#6-server-actions)
7. [Relacionamentos](#7-trabalhando-com-relacionamentos)
8. [Filtragem e Paginação](#8-filtragem-e-paginação)
9. [Transações](#9-transações)
10. [Best Practices](#10-best-practices)

---

## 1. Importar Prisma Client

```typescript
// Importar de lib/prisma.ts (singleton configurado)
import { prisma } from '@/lib/prisma'

// Ou importar diretamente (não recomendado, pode criar múltiplas instâncias)
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

---

## 2. Operações CRUD Básicas

### Create (Criar)

```typescript
// Criar um post
const post = await prisma.post.create({
  data: {
    title: 'Meu Primeiro Post',
    slug: 'meu-primeiro-post',
    content: 'Conteúdo do post...',
    excerpt: 'Resumo breve',
    status: 'PUBLISHED',
    authorId: 'user-id',
    categoryId: 'category-id',
    publishedAt: new Date(),
  },
})

// Criar com relações
const postWithTags = await prisma.post.create({
  data: {
    title: 'Post com Tags',
    slug: 'post-com-tags',
    content: 'Conteúdo...',
    authorId: 'user-id',
    tags: {
      create: [
        { tag: { connect: { id: 'tag-id-1' } } },
        { tag: { connect: { id: 'tag-id-2' } } },
      ],
    },
  },
})
```

### Read (Ler)

```typescript
// Buscar todos os posts
const posts = await prisma.post.findMany()

// Buscar por ID
const post = await prisma.post.findUnique({
  where: { id: 'post-id' },
})

// Buscar por slug
const post = await prisma.post.findUnique({
  where: { slug: 'meu-post' },
})

// Buscar primeiro resultado
const firstPost = await prisma.post.findFirst({
  where: { status: 'PUBLISHED' },
  orderBy: { publishedAt: 'desc' },
})

// Buscar vários com filtro
const publishedPosts = await prisma.post.findMany({
  where: {
    status: 'PUBLISHED',
    deletedAt: null,
  },
  orderBy: { publishedAt: 'desc' },
})
```

### Update (Atualizar)

```typescript
// Atualizar por ID
const updatedPost = await prisma.post.update({
  where: { id: 'post-id' },
  data: {
    title: 'Título Atualizado',
    updatedAt: new Date(),
  },
})

// Atualizar múltiplos
const updated = await prisma.post.updateMany({
  where: { status: 'DRAFT' },
  data: { status: 'ARCHIVED' },
})

// Incrementar contador
await prisma.post.update({
  where: { id: 'post-id' },
  data: { viewCount: { increment: 1 } },
})
```

### Delete (Deletar)

```typescript
// Hard delete (remove do banco)
await prisma.post.delete({
  where: { id: 'post-id' },
})

// Soft delete (marca como deletado)
await prisma.post.update({
  where: { id: 'post-id' },
  data: { deletedAt: new Date() },
})

// Deletar múltiplos
await prisma.post.deleteMany({
  where: { status: 'DRAFT' },
})
```

---

## 3. Queries Avançadas

### Include (Relações)

```typescript
// Incluir relações
const post = await prisma.post.findUnique({
  where: { slug: 'meu-post' },
  include: {
    author: true,
    category: true,
    tags: {
      include: {
        tag: true,
      },
    },
    featuredImage: true,
    comments: true,
  },
})
```

### Select (Campos Específicos)

```typescript
// Selecionar apenas campos necessários
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    publishedAt: true,
    author: {
      select: {
        name: true,
        avatar: true,
      },
    },
  },
})
```

### Where (Filtros Avançados)

```typescript
// Filtros complexos
const posts = await prisma.post.findMany({
  where: {
    AND: [
      { status: 'PUBLISHED' },
      { deletedAt: null },
      {
        OR: [
          { isFeatured: true },
          { viewCount: { gte: 100 } },
        ],
      },
    ],
    category: {
      slug: 'noticias',
    },
    publishedAt: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31'),
    },
  },
})

// Busca textual
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: 'diplomacia', mode: 'insensitive' } },
      { content: { contains: 'diplomacia', mode: 'insensitive' } },
    ],
  },
})
```

### OrderBy (Ordenação)

```typescript
// Ordenar por um campo
const posts = await prisma.post.findMany({
  orderBy: { publishedAt: 'desc' },
})

// Ordenar por múltiplos campos
const posts = await prisma.post.findMany({
  orderBy: [
    { isFeatured: 'desc' },
    { publishedAt: 'desc' },
  ],
})

// Ordenar por relação
const posts = await prisma.post.findMany({
  orderBy: {
    author: {
      name: 'asc',
    },
  },
})
```

---

## 4. Server Components (Next.js 15)

```typescript
// app/noticias/page.tsx
import { prisma } from '@/lib/prisma'
import { ContentStatus } from '@prisma/client'

export default async function NoticiasPage() {
  // Buscar posts diretamente no Server Component
  const posts = await prisma.post.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      deletedAt: null,
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
          color: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 12,
  })

  return (
    <div>
      <h1>Notícias</h1>
      <div className="grid">
        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <span>{post.author.name}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

// Gerar metadata dinamicamente
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  return {
    title: post?.metaTitle || post?.title,
    description: post?.metaDescription || post?.excerpt,
  }
}
```

---

## 5. API Routes

Ver exemplos completos em:
- `/app/api/posts/route.ts`
- `/app/api/posts/[slug]/route.ts`
- `/app/api/categories/route.ts`

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true, category: true },
  })

  return NextResponse.json({ success: true, data: posts })
}
```

---

## 6. Server Actions

```typescript
// app/actions/posts.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const post = await prisma.post.create({
    data: {
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      content,
      authorId: 'user-id', // TODO: Get from session
      status: 'DRAFT',
    },
  })

  revalidatePath('/noticias')
  return { success: true, post }
}

export async function deletePost(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: { deletedAt: new Date() },
  })

  revalidatePath('/noticias')
  return { success: true }
}
```

---

## 7. Trabalhando com Relacionamentos

### One-to-Many

```typescript
// Buscar categoria com seus posts
const category = await prisma.category.findUnique({
  where: { slug: 'noticias' },
  include: {
    posts: {
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    },
  },
})
```

### Many-to-Many

```typescript
// Buscar post com suas tags
const post = await prisma.post.findUnique({
  where: { id: 'post-id' },
  include: {
    tags: {
      include: {
        tag: true,
      },
    },
  },
})

// Adicionar tag a um post
await prisma.postTag.create({
  data: {
    postId: 'post-id',
    tagId: 'tag-id',
  },
})

// Remover tag de um post
await prisma.postTag.delete({
  where: {
    postId_tagId: {
      postId: 'post-id',
      tagId: 'tag-id',
    },
  },
})
```

---

## 8. Filtragem e Paginação

```typescript
// Paginação
const page = 1
const limit = 12
const skip = (page - 1) * limit

const [posts, total] = await Promise.all([
  prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    skip,
    take: limit,
    orderBy: { publishedAt: 'desc' },
  }),
  prisma.post.count({
    where: { status: 'PUBLISHED' },
  }),
])

const totalPages = Math.ceil(total / limit)

// Filtragem dinâmica
interface Filters {
  category?: string
  tags?: string[]
  search?: string
  featured?: boolean
}

function buildWhereClause(filters: Filters) {
  const where: any = {
    status: 'PUBLISHED',
    deletedAt: null,
  }

  if (filters.category) {
    where.category = { slug: filters.category }
  }

  if (filters.tags && filters.tags.length > 0) {
    where.tags = {
      some: {
        tag: {
          slug: { in: filters.tags },
        },
      },
    }
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters.featured !== undefined) {
    where.isFeatured = filters.featured
  }

  return where
}

const posts = await prisma.post.findMany({
  where: buildWhereClause(filters),
})
```

---

## 9. Transações

```typescript
// Transação simples
await prisma.$transaction([
  prisma.post.create({ data: { ... } }),
  prisma.auditLog.create({ data: { ... } }),
])

// Transação interativa
await prisma.$transaction(async (tx) => {
  // Criar post
  const post = await tx.post.create({
    data: {
      title: 'Novo Post',
      slug: 'novo-post',
      content: 'Conteúdo...',
      authorId: 'user-id',
    },
  })

  // Criar tags
  await tx.postTag.createMany({
    data: [
      { postId: post.id, tagId: 'tag-1' },
      { postId: post.id, tagId: 'tag-2' },
    ],
  })

  // Log de auditoria
  await tx.auditLog.create({
    data: {
      action: 'CREATE',
      entityType: 'Post',
      entityId: post.id,
      userId: 'user-id',
    },
  })

  return post
})
```

---

## 10. Best Practices

### ✅ Boas Práticas

```typescript
// 1. Use select para economizar banda
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    // Apenas campos necessários
  },
})

// 2. Use Promise.all para queries paralelas
const [posts, categories, tags] = await Promise.all([
  prisma.post.findMany(),
  prisma.category.findMany(),
  prisma.tag.findMany(),
])

// 3. Use count para paginação
const [data, total] = await Promise.all([
  prisma.post.findMany({ skip, take }),
  prisma.post.count({ where }),
])

// 4. Use soft delete
await prisma.post.update({
  where: { id },
  data: { deletedAt: new Date() },
})

// 5. Use índices (já configurados no schema)
const post = await prisma.post.findUnique({
  where: { slug }, // slug tem índice
})

// 6. Sempre filtre deletedAt
const posts = await prisma.post.findMany({
  where: {
    deletedAt: null, // Não retornar deletados
  },
})

// 7. Use transações para operações relacionadas
await prisma.$transaction([
  prisma.post.update({ ... }),
  prisma.auditLog.create({ ... }),
])
```

### ❌ Evite

```typescript
// ❌ Múltiplas queries em loop (N+1 problem)
const posts = await prisma.post.findMany()
for (const post of posts) {
  const author = await prisma.user.findUnique({
    where: { id: post.authorId },
  })
}

// ✅ Use include ou select
const posts = await prisma.post.findMany({
  include: { author: true },
})

// ❌ Criar múltiplas instâncias do Prisma
const prisma1 = new PrismaClient()
const prisma2 = new PrismaClient() // Problemas de conexão

// ✅ Use singleton
import { prisma } from '@/lib/prisma'

// ❌ Expor dados sensíveis
const user = await prisma.user.findUnique({
  where: { id },
})
return user // Retorna password hash!

// ✅ Use select para filtrar
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    // password: false (não incluir)
  },
})
```

---

## 📖 Recursos Adicionais

- **Schema**: `/prisma/schema.prisma`
- **Seed**: `/prisma/seed.ts`
- **API Examples**: `/app/api/posts/`
- **Prisma Docs**: https://www.prisma.io/docs
- **Prisma Client API**: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference

---

## 🔧 Comandos Úteis

```bash
# Gerar Prisma Client após modificar schema
npm run db:generate

# Sincronizar schema com banco (desenvolvimento)
npm run db:push

# Criar migration (produção)
npm run db:migrate

# Popular banco com dados
npm run db:seed

# Abrir Prisma Studio (GUI)
npm run db:studio
```

---

**Atualizado**: 16 de Novembro, 2025
