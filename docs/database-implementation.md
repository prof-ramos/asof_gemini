# Database Implementation Guide

## 🚀 Quick Start

Este guia detalha o passo a passo para implementar o banco de dados do CMS ASOF.

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+ instalado localmente ou acesso a instância cloud
- npm ou yarn
- Git

## 1️⃣ Instalação e Configuração

### 1.1 Instalar Prisma

```bash
# Instalar dependências do Prisma
npm install prisma @prisma/client

# Instalar como dev dependency
npm install -D prisma
```

### 1.2 Configurar Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto:

```env
# .env

# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/asof_cms?schema=public"

# Para desenvolvimento local com Docker
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/asof_cms?schema=public"

# Para produção (Vercel Postgres, Supabase, Neon, etc.)
# DATABASE_URL="postgresql://user:pass@host.region.provider.com:5432/database"

# Session & Auth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"

# Email (para reset de senha, notificações)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Storage (S3, R2, Cloudflare Images)
STORAGE_PROVIDER="local" # ou "s3", "r2"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET=""

# Redis (para cache)
REDIS_URL="redis://localhost:6379"

# Analytics
NEXT_PUBLIC_GA_ID=""
```

**Adicionar ao `.env.local` e `.env.example`:**

```bash
cp .env .env.local
cp .env .env.example
```

**Adicionar ao `.gitignore`:**

```gitignore
# Databases
.env
.env.local
*.db
*.db-journal

# Prisma
prisma/migrations/
```

### 1.3 PostgreSQL Setup

#### Opção A: Docker (Recomendado para desenvolvimento)

```bash
# Criar docker-compose.yml
cat > docker-compose.yml <<EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: asof_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: asof_cms
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: asof_redis
    restart: always
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Iniciar containers
docker-compose up -d

# Verificar se está rodando
docker-compose ps
```

#### Opção B: PostgreSQL Local

```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Criar database
createdb asof_cms

# Criar usuário
psql -c "CREATE USER asof WITH PASSWORD 'senha_segura';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE asof_cms TO asof;"
```

#### Opção C: Cloud Providers (Produção)

**Vercel Postgres:**
```bash
# Instalar CLI
npm i -g vercel

# Criar database
vercel postgres create asof-cms

# Obter connection string
vercel postgres connect
```

**Supabase:**
1. Acessar https://supabase.com
2. Criar novo projeto
3. Copiar connection string de Settings > Database

**Neon:**
1. Acessar https://neon.tech
2. Criar novo projeto
3. Copiar connection string

**Railway:**
1. Acessar https://railway.app
2. New Project > PostgreSQL
3. Copiar connection string

## 2️⃣ Configuração Prisma

### 2.1 Inicializar Prisma

O schema já foi criado em `/prisma/schema.prisma`. Vamos verificar:

```bash
# Verificar schema
cat prisma/schema.prisma

# Formatar schema
npx prisma format
```

### 2.2 Criar Migration Inicial

```bash
# Criar primeira migration
npx prisma migrate dev --name init

# Este comando irá:
# 1. Criar todas as tabelas no banco
# 2. Gerar o Prisma Client
# 3. Criar pasta prisma/migrations/
```

### 2.3 Gerar Prisma Client

```bash
# Gerar client (já feito pelo migrate, mas pode rodar novamente)
npx prisma generate
```

### 2.4 Abrir Prisma Studio

```bash
# Interface visual para ver/editar dados
npx prisma studio

# Abre em http://localhost:5555
```

## 3️⃣ Criação de Seed Data

### 3.1 Criar Script de Seed

```typescript
// prisma/seed.ts
import { PrismaClient, UserRole, UserStatus, ContentStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Limpar dados existentes (desenvolvimento apenas!)
  if (process.env.NODE_ENV === 'development') {
    await prisma.auditLog.deleteMany()
    await prisma.postTag.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()
    await prisma.page.deleteMany()
    await prisma.category.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.media.deleteMany()
    await prisma.mediaFolder.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Cleared existing data')
  }

  // 1. Criar usuários
  const hashedPassword = await bcrypt.hash('senha123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@asof.org.br',
      name: 'Administrador ASOF',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      bio: 'Administrador do sistema'
    }
  })

  const editor = await prisma.user.create({
    data: {
      email: 'editor@asof.org.br',
      name: 'Editor ASOF',
      password: hashedPassword,
      role: UserRole.EDITOR,
      status: UserStatus.ACTIVE,
      emailVerified: new Date()
    }
  })

  console.log('✅ Created users')

  // 2. Criar categorias
  const categorias = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Negociações',
        slug: 'negociacoes',
        description: 'Notícias sobre negociações salariais e benefícios',
        color: '#82b4d6',
        icon: 'briefcase',
        createdById: admin.id
      }
    }),
    prisma.category.create({
      data: {
        name: 'Eventos',
        slug: 'eventos',
        description: 'Eventos e encontros da ASOF',
        color: '#0D2A4A',
        icon: 'calendar',
        createdById: admin.id
      }
    }),
    prisma.category.create({
      data: {
        name: 'Institucional',
        slug: 'institucional',
        description: 'Notícias institucionais',
        color: '#040920',
        icon: 'building',
        createdById: admin.id
      }
    })
  ])

  console.log('✅ Created categories')

  // 3. Criar tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Saúde', slug: 'saude', color: '#22c55e' } }),
    prisma.tag.create({ data: { name: 'Salário', slug: 'salario', color: '#3b82f6' } }),
    prisma.tag.create({ data: { name: 'Benefícios', slug: 'beneficios', color: '#8b5cf6' } }),
    prisma.tag.create({ data: { name: 'Eleições', slug: 'eleicoes', color: '#f59e0b' } })
  ])

  console.log('✅ Created tags')

  // 4. Criar posts (migração dos MDX existentes)
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Avanço nas Negociações Salariais 2024',
        slug: 'avanco-negociacao-salarial',
        excerpt: 'ASOF obtém progresso significativo nas negociações com o Itamaraty para reajuste salarial de 2024.',
        content: `# Avanço nas Negociações Salariais 2024

A ASOF conquistou importantes avanços nas negociações com o Itamaraty para o reajuste salarial de 2024...`,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date('2024-03-15'),
        authorId: editor.id,
        categoryId: categorias[0].id,
        readingTime: 3,
        isFeatured: true,
        metaTitle: 'Avanço nas Negociações Salariais 2024 | ASOF',
        metaDescription: 'ASOF obtém progresso significativo nas negociações salariais. Confira os detalhes.',
        viewCount: 234
      }
    }),
    prisma.post.create({
      data: {
        title: 'Encontro sobre Saúde Mental dos Oficiais',
        slug: 'encontro-saude-mental',
        excerpt: 'ASOF promove evento sobre saúde mental e qualidade de vida dos oficiais de chancelaria.',
        content: `# Encontro sobre Saúde Mental dos Oficiais

A ASOF realizou um importante encontro focado em saúde mental...`,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date('2024-02-20'),
        authorId: editor.id,
        categoryId: categorias[1].id,
        readingTime: 4,
        isFeatured: true,
        viewCount: 189
      }
    }),
    prisma.post.create({
      data: {
        title: 'Eleições para Diretoria 2025',
        slug: 'eleicoes-diretoria-2025',
        excerpt: 'Processo eleitoral para nova diretoria da ASOF será realizado em dezembro de 2024.',
        content: `# Eleições para Diretoria 2025

O processo eleitoral para escolha da nova diretoria...`,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date('2024-01-10'),
        authorId: admin.id,
        categoryId: categorias[2].id,
        readingTime: 5,
        viewCount: 156
      }
    })
  ])

  console.log('✅ Created posts')

  // 5. Associar tags aos posts
  await prisma.postTag.createMany({
    data: [
      { postId: posts[0].id, tagId: tags[1].id }, // Salário
      { postId: posts[0].id, tagId: tags[2].id }, // Benefícios
      { postId: posts[1].id, tagId: tags[0].id }, // Saúde
      { postId: posts[2].id, tagId: tags[3].id }  // Eleições
    ]
  })

  console.log('✅ Associated tags')

  // 6. Criar páginas estáticas
  await Promise.all([
    prisma.page.create({
      data: {
        title: 'Quem Somos',
        slug: 'sobre',
        content: '# História da ASOF\n\nFundada em...',
        type: 'STATIC',
        status: ContentStatus.PUBLISHED,
        authorId: admin.id,
        publishedAt: new Date(),
        showInNav: true,
        order: 1
      }
    }),
    prisma.page.create({
      data: {
        title: 'Contato',
        slug: 'contato',
        content: '# Entre em Contato\n\nEstamos aqui para ajudar...',
        type: 'STATIC',
        status: ContentStatus.PUBLISHED,
        authorId: admin.id,
        publishedAt: new Date(),
        showInNav: true,
        order: 5
      }
    })
  ])

  console.log('✅ Created pages')

  // 7. Criar configurações do sistema
  await prisma.setting.createMany({
    data: [
      {
        key: 'site.title',
        value: 'ASOF - Associação dos Oficiais de Chancelaria',
        type: 'string',
        category: 'general',
        isPublic: true
      },
      {
        key: 'site.description',
        value: 'Website institucional da ASOF',
        type: 'string',
        category: 'general',
        isPublic: true
      },
      {
        key: 'social.facebook',
        value: 'https://facebook.com/asof',
        type: 'string',
        category: 'social',
        isPublic: true
      },
      {
        key: 'contact.email',
        value: 'contato@asof.org.br',
        type: 'string',
        category: 'general',
        isPublic: true
      }
    ]
  })

  console.log('✅ Created settings')

  // 8. Criar navegação
  await prisma.navigation.createMany({
    data: [
      { label: 'Início', url: '/', order: 1, location: 'header' },
      { label: 'Quem Somos', url: '/sobre', order: 2, location: 'header' },
      { label: 'Notícias', url: '/noticias', order: 3, location: 'header' },
      { label: 'Transparência', url: '/transparencia', order: 4, location: 'header' },
      { label: 'Contato', url: '/contato', order: 5, location: 'header' }
    ]
  })

  console.log('✅ Created navigation')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: ${await prisma.user.count()}`)
  console.log(`- Categories: ${await prisma.category.count()}`)
  console.log(`- Tags: ${await prisma.tag.count()}`)
  console.log(`- Posts: ${await prisma.post.count()}`)
  console.log(`- Pages: ${await prisma.page.count()}`)
  console.log(`- Settings: ${await prisma.setting.count()}`)
  console.log(`- Navigation: ${await prisma.navigation.count()}`)
  console.log('\n👤 Admin Login:')
  console.log('   Email: admin@asof.org.br')
  console.log('   Senha: senha123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 3.2 Configurar Script de Seed

```json
// package.json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "scripts": {
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate"
  },
  "devDependencies": {
    "ts-node": "^10.9.1",
    "@types/bcrypt": "^5.0.0"
  },
  "dependencies": {
    "bcrypt": "^5.1.1"
  }
}
```

### 3.3 Instalar Dependências e Executar Seed

```bash
# Instalar dependências
npm install bcrypt
npm install -D @types/bcrypt ts-node

# Executar seed
npm run db:seed
```

## 4️⃣ Criar Prisma Client Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error']
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
```

## 5️⃣ Criar API Routes

### 5.1 Posts API

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const category = searchParams.get('category')
  const status = searchParams.get('status') || 'PUBLISHED'

  const where = {
    status,
    deletedAt: null,
    ...(category && { category: { slug: category } })
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        readingTime: true,
        viewCount: true,
        isFeatured: true,
        author: {
          select: { name: true, avatar: true }
        },
        category: {
          select: { name: true, slug: true, color: true }
        },
        featuredImage: {
          select: { url: true, alt: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit
    }),
    prisma.post.count({ where })
  ])

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}
```

### 5.2 Single Post API

```typescript
// app/api/posts/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
      status: 'PUBLISHED',
      deletedAt: null
    },
    include: {
      author: {
        select: { name: true, avatar: true, bio: true }
      },
      category: {
        select: { name: true, slug: true, color: true }
      },
      featuredImage: true,
      tags: {
        include: { tag: true }
      },
      comments: {
        where: { status: 'PUBLISHED', parentId: null },
        include: {
          user: {
            select: { name: true, avatar: true }
          },
          replies: {
            include: {
              user: {
                select: { name: true, avatar: true }
              }
            }
          }
        }
      }
    }
  })

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Incrementar view count
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } }
  })

  return NextResponse.json(post)
}
```

## 6️⃣ Scripts de Manutenção

### 6.1 Backup Script

```bash
#!/bin/bash
# scripts/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/asof_cms_$DATE.sql"

mkdir -p $BACKUP_DIR

# Fazer backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Comprimir
gzip $BACKUP_FILE

# Remover backups antigos (manter últimos 30 dias)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup created: $BACKUP_FILE.gz"
```

### 6.2 Cleanup Soft Deletes

```typescript
// scripts/cleanup-soft-deletes.ts
import prisma from '@/lib/prisma'

async function cleanupSoftDeletes() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Deletar permanentemente registros soft deleted há mais de 6 meses
  const result = await prisma.$transaction([
    prisma.post.deleteMany({
      where: {
        deletedAt: { lt: sixMonthsAgo }
      }
    }),
    prisma.user.deleteMany({
      where: {
        deletedAt: { lt: sixMonthsAgo }
      }
    }),
    prisma.media.deleteMany({
      where: {
        deletedAt: { lt: sixMonthsAgo }
      }
    })
  ])

  console.log('Cleanup completed:', result)
}

cleanupSoftDeletes()
```

## 7️⃣ Deploy Checklist

### Development
- [x] Schema Prisma criado
- [x] Migrations executadas localmente
- [x] Seed data criado
- [x] API routes testadas
- [x] Prisma Studio funcionando

### Staging/Production
- [ ] Database provisionado (Vercel Postgres, Supabase, etc.)
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations executadas
- [ ] Seed data executado (se necessário)
- [ ] Connection pooling configurado
- [ ] Backups automáticos habilitados
- [ ] Monitoring configurado
- [ ] Redis configurado (cache)
- [ ] CDN configurado (media files)

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run db:studio          # Abrir Prisma Studio
npm run db:seed            # Executar seed
npm run db:reset           # Reset database (apaga tudo!)

# Migrations
npx prisma migrate dev     # Criar e aplicar migration (dev)
npx prisma migrate deploy  # Aplicar migrations (prod)
npx prisma migrate status  # Ver status das migrations

# Prisma Client
npx prisma generate        # Gerar client
npx prisma format          # Formatar schema

# Debugging
npx prisma validate        # Validar schema
npx prisma db pull         # Puxar schema do banco (introspection)
npx prisma db push         # Push schema para banco (sem migrations)
```

## 📚 Próximos Passos

1. **Autenticação**: Implementar NextAuth.js
2. **Admin Panel**: Criar interface de administração
3. **Upload de Mídia**: Integrar com S3/R2
4. **API Routes**: Completar CRUD para todas entidades
5. **Migração MDX**: Script para migrar posts MDX existentes
6. **Testes**: Implementar testes de integração
7. **Monitoring**: Configurar Sentry e logging

---

**Última atualização**: 2024-11-16
**Versão**: 1.0.0
