# Prisma ORM - Documentação Completa para LLMs

> **Fonte**: https://www.prisma.io/docs/llms-full.txt
> **Atualizado**: 2025-01-16
> **Versão Prisma**: 6.19.0

---

## Visão Geral

Prisma é uma ferramenta ORM (Object-Relational Mapping) de código aberto que fornece acesso type-safe ao banco de dados para aplicações TypeScript e JavaScript. Esta documentação cobre quickstarts, conexões de banco de dados, migrations e padrões de consulta.

---

## 1. Guias de Início Rápido

### 1.1 Prisma Postgres Quickstart

Permite aos desenvolvedores configurar um banco de dados PostgreSQL gerenciado através do Prisma Data Platform (PDP) Console.

**Processo de Setup**:
1. Criar projeto no PDP Console
2. Configurar acesso ao banco de dados
3. Executar schema migrations usando `npx prisma migrate dev --name init`

### 1.2 SQLite Quickstart

Fornece uma opção de desenvolvimento local usando bancos de dados SQLite baseados em arquivo.

**Casos de Uso**:
- Prototipagem rápida
- Desenvolvimento sem infraestrutura externa de banco de dados
- Testes locais

---

## 2. Configuração de Conexão com Banco de Dados

### 2.1 Formatos de URL de Conexão

#### PostgreSQL
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

**Exemplo**:
```env
DATABASE_URL="postgresql://johndoe:mypassword@localhost:5432/mydb?schema=public"
```

#### MySQL
```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

**Exemplo**:
```env
DATABASE_URL="mysql://root:mypassword@localhost:3306/mydb"
```

#### SQL Server
```
sqlserver://HOST:PORT;database=DATABASE;user=USER;password=PASSWORD
```

Suporta múltiplas abordagens de autenticação com protocolo `sqlserver://`.

#### CockroachDB
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

Adota o formato de URL de conexão PostgreSQL com protocolo `postgresql://`.

#### PlanetScale
```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

Formato compatível com MySQL com configuração de relation mode para emulação de constraints.

**Configuração Especial**:
```prisma
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### 2.2 Gerenciamento de Variáveis de Ambiente

Strings de conexão são gerenciadas através de arquivos `.env`:

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

**Referência no Schema Prisma**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 3. Gerenciamento de Schema

### 3.1 Prisma Migrate

Cria mudanças de schema de banco de dados com controle de versão.

**Características**:
- Executa arquivos SQL de migration contra o banco de dados
- Gera arquivos de migration correspondentes no diretório `prisma/migrations`
- Mantém histórico completo de mudanças

### 3.2 Fluxos de Trabalho

#### Desenvolvimento com Histórico Completo

```bash
npx prisma migrate dev --name <migration-name>
```

**Quando usar**:
- Ambientes de produção
- Trabalho em equipe
- Histórico completo de migrations necessário

**Exemplo**:
```bash
npx prisma migrate dev --name add_user_profile
```

#### Prototipagem Rápida

```bash
npx prisma db push
```

**Quando usar**:
- Desenvolvimento rápido local
- Prototipagem
- Mudanças experimentais

**Características**:
- Sincroniza mudanças de schema diretamente
- Não cria registros de migration
- Otimizado para iteração rápida

### 3.3 Aplicar Migrations em Produção

```bash
npx prisma migrate deploy
```

**Características**:
- Aplica migrations pendentes
- Não gera novas migrations
- Seguro para ambientes de produção

---

## 4. Modelagem de Dados

### 4.1 Definição de Models

Models Prisma definem modelos que representam tabelas do banco de dados.

**Exemplo Básico**:
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
  profile   Profile?
}
```

### 4.2 Relacionamentos

#### One-to-Many (Um para Muitos)

**Exemplo**: Um autor tem muitos posts

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

#### One-to-One (Um para Um)

**Exemplo**: Um usuário tem um perfil

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}
```

#### Many-to-Many (Muitos para Muitos)

**Exemplo**: Posts e Tags

```prisma
model Post {
  id   Int    @id @default(autoincrement())
  tags Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

### 4.3 Atributos e Modificadores Comuns

| Atributo | Descrição | Exemplo |
|----------|-----------|---------|
| `@id` | Chave primária | `id Int @id` |
| `@unique` | Valor único | `email String @unique` |
| `@default()` | Valor padrão | `createdAt DateTime @default(now())` |
| `@updatedAt` | Auto-atualiza timestamp | `updatedAt DateTime @updatedAt` |
| `@relation` | Define relacionamento | `@relation(fields: [authorId], references: [id])` |
| `?` | Campo opcional | `name String?` |
| `[]` | Lista/array | `posts Post[]` |

---

## 5. Operações de Consulta (Prisma Client)

### 5.1 Instalação e Geração

**Instalação**:
```bash
npm install @prisma/client
```

**Geração do Cliente**:
```bash
npx prisma generate
```

A instalação do pacote `@prisma/client` fornece a interface de consulta. A geração de código cria APIs type-safe que correspondem aos modelos definidos no schema.

### 5.2 Operações CREATE

#### Create Simples

```typescript
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    name: 'Alice',
  },
})
```

#### Create com Nested Writes

Insere simultaneamente registros pai e relacionados em múltiplas tabelas em transações únicas.

```typescript
const user = await prisma.user.create({
  data: {
    email: 'bob@example.com',
    name: 'Bob',
    posts: {
      create: [
        { title: 'First Post', content: 'Hello World' },
        { title: 'Second Post', content: 'Prisma is awesome' },
      ],
    },
    profile: {
      create: {
        bio: 'Software Developer',
      },
    },
  },
})
```

#### CreateMany

```typescript
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
    { email: 'user3@example.com', name: 'User 3' },
  ],
})
```

### 5.3 Operações READ

#### FindMany - Buscar Múltiplos Registros

```typescript
const users = await prisma.user.findMany()
```

#### FindMany com Include (Nested Objects)

```typescript
const users = await prisma.user.findMany({
  include: {
    posts: true,
    profile: true,
  },
})
```

#### FindMany com Where (Filtros)

```typescript
const users = await prisma.user.findMany({
  where: {
    email: {
      contains: '@example.com',
    },
  },
})
```

#### FindUnique - Buscar Registro Único

```typescript
const user = await prisma.user.findUnique({
  where: {
    email: 'alice@example.com',
  },
})
```

#### FindFirst - Primeiro Registro Correspondente

```typescript
const user = await prisma.user.findFirst({
  where: {
    name: {
      startsWith: 'A',
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

### 5.4 Operações UPDATE

#### Update Simples

```typescript
const user = await prisma.user.update({
  where: {
    email: 'alice@example.com',
  },
  data: {
    name: 'Alice Updated',
  },
})
```

#### Update com Nested Writes

```typescript
const user = await prisma.user.update({
  where: {
    email: 'bob@example.com',
  },
  data: {
    profile: {
      update: {
        bio: 'Senior Software Developer',
      },
    },
  },
})
```

#### UpdateMany

```typescript
const result = await prisma.user.updateMany({
  where: {
    email: {
      contains: '@example.com',
    },
  },
  data: {
    name: 'Updated User',
  },
})
```

### 5.5 Operações DELETE

#### Delete Simples

```typescript
const user = await prisma.user.delete({
  where: {
    email: 'alice@example.com',
  },
})
```

#### DeleteMany

```typescript
const result = await prisma.user.deleteMany({
  where: {
    createdAt: {
      lt: new Date('2023-01-01'),
    },
  },
})
```

### 5.6 Operações Avançadas

#### Count

```typescript
const count = await prisma.user.count({
  where: {
    posts: {
      some: {
        published: true,
      },
    },
  },
})
```

#### Aggregate

```typescript
const result = await prisma.post.aggregate({
  _count: true,
  _avg: {
    viewCount: true,
  },
  _sum: {
    viewCount: true,
  },
})
```

#### GroupBy

```typescript
const result = await prisma.post.groupBy({
  by: ['authorId'],
  _count: {
    id: true,
  },
  _avg: {
    viewCount: true,
  },
})
```

---

## 6. Recursos Avançados

### 6.1 Prisma Accelerate

Fornece connection pooling e caching com estratégias Stale-While-Revalidate (SWR) e Time-To-Live (TTL) para otimização de consultas.

**Instalação**:
```bash
npm install @prisma/extension-accelerate
```

**Configuração**:
```typescript
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
```

**Uso com Cache**:
```typescript
const users = await prisma.user.findMany({
  cacheStrategy: {
    ttl: 60, // Cache por 60 segundos
    swr: 10, // Stale-while-revalidate por 10 segundos
  },
})
```

**Benefícios**:
- Connection pooling automático
- Query caching configurável
- Redução de latência
- Otimização de performance

### 6.2 Prisma Studio

GUI visual para navegar e editar registros do banco de dados diretamente.

**Acesso Local**:
```bash
npx prisma studio
```

**Acesso via PDP Console**:
Disponível através da interface web do Prisma Data Platform.

**Características**:
- Interface visual intuitiva
- Edição inline de registros
- Navegação de relacionamentos
- Filtragem e busca avançada

### 6.3 Transactions

#### Sequential Operations

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({
    data: { email: 'test@example.com', name: 'Test' },
  }),
  prisma.post.create({
    data: { title: 'Test Post', authorId: 1 },
  }),
])
```

#### Interactive Transactions

```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'test@example.com', name: 'Test' },
  })

  const post = await tx.post.create({
    data: {
      title: 'Test Post',
      authorId: user.id,
    },
  })

  return { user, post }
})
```

### 6.4 Middleware

```typescript
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)

  return result
})
```

### 6.5 Raw Queries

#### Raw SQL

```typescript
const users = await prisma.$queryRaw`SELECT * FROM User WHERE email = ${'alice@example.com'}`
```

#### Execute Raw

```typescript
const result = await prisma.$executeRaw`UPDATE User SET name = ${'New Name'} WHERE id = ${1}`
```

---

## 7. Workflow Padrão de Setup

### Passo 1: Inicializar Projeto

```bash
npm init -y
npm install prisma @prisma/client typescript ts-node @types/node --save-dev
npx prisma init
```

### Passo 2: Definir Schema Models

Editar `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Passo 3: Configurar Variável de Ambiente

Criar `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### Passo 4: Executar Migrations

```bash
npx prisma migrate dev --name init
```

### Passo 5: Gerar Prisma Client

```bash
npx prisma generate
```

### Passo 6: Usar em Código TypeScript

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: {
          title: 'Hello World',
          content: 'This is my first post',
        },
      },
    },
  })

  // Buscar todos os usuários com posts
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })

  console.log(users)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 8. Melhores Práticas

### 8.1 Singleton Pattern (Next.js)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

### 8.2 Error Handling

```typescript
import { Prisma } from '@prisma/client'

try {
  await prisma.user.create({
    data: {
      email: 'duplicate@example.com',
    },
  })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      console.log('Email already exists')
    }
  }
  throw error
}
```

### 8.3 Logging

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

### 8.4 Connection Pooling

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // Connection pool settings
  relationMode = "prisma"
}
```

---

## 9. Comandos CLI Essenciais

| Comando | Descrição |
|---------|-----------|
| `npx prisma init` | Inicializa Prisma no projeto |
| `npx prisma generate` | Gera Prisma Client |
| `npx prisma migrate dev` | Cria e aplica migration (dev) |
| `npx prisma migrate deploy` | Aplica migrations (produção) |
| `npx prisma db push` | Sincroniza schema sem migration |
| `npx prisma db pull` | Introspeta banco e atualiza schema |
| `npx prisma studio` | Abre Prisma Studio (GUI) |
| `npx prisma validate` | Valida schema Prisma |
| `npx prisma format` | Formata schema Prisma |

---

## 10. Referências

- **Site Oficial**: https://www.prisma.io
- **Documentação**: https://www.prisma.io/docs
- **GitHub**: https://github.com/prisma/prisma
- **Community**: https://www.prisma.io/community
- **Prisma Studio**: https://www.prisma.io/studio
- **Prisma Data Platform**: https://cloud.prisma.io

---

**Última Atualização**: 2025-01-16
**Maintido por**: Equipe de Desenvolvimento ASOF
**Versão do Documento**: 1.0.0
