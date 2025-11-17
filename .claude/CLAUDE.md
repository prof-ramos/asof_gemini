# ASOF Website - Guia Técnico para Claude Code

## Visão Geral do Projeto

**Projeto**: Site Institucional ASOF - Associação dos Oficiais de Chancelaria
**Framework**: Next.js 15 com App Router
**Linguagem**: TypeScript (strict mode)
**Estilização**: Tailwind CSS 3.4 + Framer Motion
**Banco de Dados**: Prisma + PostgreSQL (**ATIVO - admin panel e autenticação**)
**Testes**: Playwright (E2E)
**Deployment**: Vercel

O projeto é um site institucional moderno com **painel admin completo**, sistema de autenticação, REST API, blog em MDX, animações com Framer Motion, banco de dados PostgreSQL via Prisma, e testes E2E completos.

---

## 1. ARQUITETURA DO PROJETO

### Estrutura Geral

```
asof_gemini/
├── app/                      # App Router do Next.js (Server Components por padrão)
│   ├── layout.tsx           # Layout raiz com metadata, Header, Footer
│   ├── globals.css          # Estilos globais + Tailwind
│   ├── page.tsx             # Homepage
│   ├── login/               # 🔐 Página de login admin
│   │   └── page.tsx
│   ├── admin/               # 🔐 Painel administrativo (protegido)
│   │   ├── layout.tsx       # Layout com sidebar e header
│   │   ├── page.tsx         # Dashboard principal
│   │   └── media/           # Biblioteca de mídia
│   │       └── page.tsx
│   ├── api/                 # 🔌 REST API Routes
│   │   ├── auth/            # Autenticação
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── posts/           # Posts CRUD
│   │   │   ├── route.ts
│   │   │   └── [slug]/route.ts
│   │   ├── media/           # Mídia CRUD
│   │   │   ├── route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── [id]/route.ts
│   │   └── categories/      # Categorias
│   │       └── route.ts
│   ├── [pasta]/page.tsx     # Páginas estáticas (sobre, atuacao, contato, etc)
│   └── noticias/
│       ├── page.tsx         # Listagem de notícias
│       └── [slug]/page.tsx  # Artigo individual (MDX)
│
├── components/
│   ├── ui/                  # Componentes reutilizáveis (Button, Card, Badge, etc)
│   ├── layout/              # Layout components (Header, Footer, MobileMenu)
│   ├── admin/               # 🔐 Componentes do painel admin
│   │   ├── AdminHeader.tsx
│   │   ├── MediaUpload.tsx
│   │   ├── MediaGrid.tsx
│   │   ├── MediaPreview.tsx
│   │   └── MediaFilters.tsx
│   ├── effects/             # ✨ Componentes de animação
│   │   └── RevealOnScroll.tsx
│   ├── sections/            # Seções da homepage (Hero, About, Pillars, News, CTA)
│   └── mdx/                 # Componentes para renderização MDX
│
├── lib/
│   ├── utils.ts            # Funções utilitárias (cn, formatDate)
│   ├── constants.ts        # SITE_CONFIG, NAV_ITEMS, COLORS
│   ├── fonts.ts            # Playfair Display + Inter otimizadas
│   ├── design-tokens.ts    # Sistema de spacing, button heights, icon sizes
│   ├── motion-config.ts    # ✨ Configuração Framer Motion (easing, duration, stagger)
│   ├── motion-variants.ts  # ✨ Variantes de animação reutilizáveis
│   ├── color-combinations.ts # Paleta de cores e combinações
│   ├── mdx.ts              # Funções para processar MDX
│   ├── prisma.ts           # Prisma Client singleton
│   └── performance.ts      # Web Vitals e análise
│
├── hooks/
│   ├── ui/
│   │   ├── useScrollPosition.ts  # Detecção de scroll
│   │   └── index.ts              # Barrel exports
│   ├── useWebVitals.ts          # Tracking Web Vitals
│   ├── useMousePosition.ts      # Posição do mouse
│   ├── useReducedMotion.ts      # Preferência de animação reduzida
│   └── index.ts                 # Barrel exports
│
├── types/
│   └── index.ts            # Interfaces TypeScript (ButtonProps, CardProps, etc)
│
├── content/
│   └── noticias/           # Arquivos .mdx com artigos/notícias
│
├── public/
│   ├── images/             # Imagens otimizadas
│   └── icons/              # Ícones e favicon
│
├── e2e/                    # Testes End-to-End com Playwright
│   ├── pages/              # Page Object Models (BasePage, HomePage, etc)
│   ├── tests/              # Arquivos de teste (static/, news/, accessibility/, etc)
│   ├── fixtures/           # Dados de teste
│   └── utils/              # Funções auxiliares
│
├── prisma/
│   ├── schema.prisma       # Schema de banco de dados (20+ modelos)
│   ├── seed.ts            # Script de seed (dados iniciais)
│   └── README.md          # Documentação Prisma
│
├── docs/                   # Documentação técnica para LLMs
│   ├── README.md          # Índice de documentação
│   ├── llm-*.md           # Guias específicos por tecnologia
│   └── database-*.md      # Documentação de banco de dados
│
└── scripts/               # Scripts utilitários
```

### Stack Tecnológico Principal

| Aspecto | Tecnologia | Versão |
|---------|-----------|--------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Next.js | 15.1.8 |
| **UI Library** | React | 19.0.0 |
| **Linguagem** | TypeScript | 5+ |
| **Estilos** | Tailwind CSS | 3.4.1 |
| **Animações** | Framer Motion | 12.23.24 |
| **Blog** | MDX | 3.1.1 |
| **ORM** | Prisma | 6.19.0 |
| **Database** | PostgreSQL | 15+ |
| **Autenticação** | bcryptjs | 3.0.3 |
| **Storage** | Vercel Blob | 2.0.0 |
| **Testes** | Playwright | 1.49.0 |
| **Ícones** | Lucide React | 0.553.0 |
| **Analytics** | Vercel Analytics & Speed Insights | latest |

---

## 2. PADRÕES E CONVENÇÕES

### Server vs Client Components

**REGRA CRÍTICA**: Por padrão, componentes são Server Components. Use `"use client"` apenas quando necessário.

```typescript
// ✅ CORRETO - Server Component (padrão)
export default function MyPage() {
  // Pode usar async, database calls, etc
  return <div>Content</div>
}

// ⚠️ Client Component (quando necessário para interatividade)
"use client"
import { useState } from 'react'
export default function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### TypeScript Strict Mode

Todas as opções de strict mode estão ativadas no `tsconfig.json`:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

```typescript
// ✅ CORRETO - Tipos explícitos obrigatórios
interface Props {
  title: string
  count: number
}

function MyComponent({ title, count }: Props): React.ReactNode {
  return <div>{title}: {count}</div>
}

// ❌ ERRADO - Tipos implícitos causam erro
function MyComponent({ title, count }) {
  return <div>{title}: {count}</div>
}
```

### Nomenclatura de Arquivos

- **Componentes**: PascalCase (`Button.tsx`, `HomePage.tsx`)
- **Páginas**: `page.tsx` (padrão Next.js)
- **Layouts**: `layout.tsx` (padrão Next.js)
- **Funções/hooks**: camelCase (`useScrollPosition.ts`, `formatDate.ts`)
- **Types/interfaces**: PascalCase (`ButtonProps.ts`)
- **Testes**: `*.spec.ts` (Playwright)

### Estrutura de Componentes

```typescript
// ✅ PADRÃO - Estrutura recomendada
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './MyComponent.module.css' // opcional

interface MyComponentProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function MyComponent({
  children,
  variant = 'primary',
  className = '',
}: MyComponentProps) {
  return (
    <div className={cn('base-styles', styles[variant], className)}>
      {children}
    </div>
  )
}
```

---

## 3. PADRÕES DE ESTILIZAÇÃO

### Sistema de Design - Design Tokens

O projeto usa design tokens centralizados em `/lib/design-tokens.ts`:

```typescript
// Spacing (8pt grid)
SPACING.xs = '4px'
SPACING.sm = '8px'
SPACING.md = '16px'
SPACING.lg = '24px'
SPACING.xl = '32px'

// Button Heights (Acessibilidade Mobile)
BUTTON_HEIGHTS.mobile.sm = '48px'  // iOS 44px + Android 48px
BUTTON_HEIGHTS.mobile.md = '50px'  // Ideal MIT Touch Lab
BUTTON_HEIGHTS.desktop.md = '48px' // Padrão desktop

// Icon Sizes (alinhamento com text)
ICON_SIZES.base = 24  // Para text-base
ICON_SIZES.xl = 32    // Para text-xl
```

### Paleta de Cores

Definida em `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#040920',  // Azul escuro
    dark: '#0D2A4A',     // Azul médio
  },
  accent: {
    DEFAULT: '#82b4d6',  // Azul claro
    light: '#a0c8e4',    // Azul muito claro
  },
  neutral: {
    DEFAULT: '#e7edf4',  // Fundo neutro
  },
}
```

### Tailwind CSS - Regras

- Use classes Tailwind direto quando possível
- Para componentes reutilizáveis, use `cn()` (clsx + tailwind-merge)
- Evite `@apply` - prefira composição de classes

```typescript
// ✅ BOM
<button className={cn(
  'px-4 py-2 rounded',
  'bg-primary text-white',
  'hover:bg-primary-dark transition-colors',
  className // permite override
)} />

// ❌ EVITAR
<style>
@apply px-4 py-2 rounded bg-primary text-white;
</style>
```

### Fontes Otimizadas

Duas fontes do Google otimizadas com `next/font`:

```typescript
// lib/fonts.ts
export const playfair = Playfair_Display({...}) // Headings
export const inter = Inter({...})               // Body text

// app/layout.tsx
<html className={`${playfair.variable} ${inter.variable}`}>
```

Use no Tailwind:
```tailwind
font-serif  /* Playfair Display */
font-sans   /* Inter */
```

### Sistema de Animações - Framer Motion

O projeto usa Framer Motion para animações elegantes e acessíveis. Todas as configurações estão centralizadas em `/lib/motion-config.ts`.

#### Easing Functions
```typescript
import { EASING } from '@/lib/motion-config'

EASING.elegant    // [0.22, 1, 0.36, 1] - Hero animations, principais
EASING.smooth     // [0.4, 0, 0.2, 1] - Hover effects, padrão
EASING.spring     // [0.68, -0.55, 0.265, 1.55] - Bounce sutil (usar com moderação)
EASING.sharp      // [0.4, 0, 0.6, 1] - Modais, dropdowns
EASING.easeOut    // [0, 0, 0.2, 1] - Scroll reveals
EASING.easeIn     // [0.4, 0, 1, 1] - Exit animations
```

#### Durações Padronizadas
```typescript
import { DURATION } from '@/lib/motion-config'

DURATION.instant   // 0s - Mudanças imediatas
DURATION.fast      // 0.15s - Button hover
DURATION.quick     // 0.25s - Dropdowns, tooltips
DURATION.normal    // 0.4s - Cards hover, state changes
DURATION.slow      // 0.6s - Section reveals
DURATION.elegant   // 0.8s - Hero animations
DURATION.verySlow  // 1.2s - Background effects
```

#### Stagger Effects
```typescript
import { STAGGER } from '@/lib/motion-config'

STAGGER.sm  // 0.05s - Lista pequena (3-5 items)
STAGGER.md  // 0.1s - Grid de cards, navigation
STAGGER.lg  // 0.15s - Seções grandes
STAGGER.xl  // 0.2s - Timeline effects
```

#### Uso Básico
```typescript
import { motion } from 'framer-motion'
import { TRANSITION } from '@/lib/motion-config'

// Fade in simples
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={TRANSITION.default}
>
  Content
</motion.div>

// Slide up + fade
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={TRANSITION.elegant}
>
  Content
</motion.div>
```

#### Scroll-Triggered Animations
```typescript
import { RevealOnScroll } from '@/components/effects/RevealOnScroll'

// Usando componente pronto
<RevealOnScroll variant="fadeInUp">
  <div>Conteúdo que anima no scroll</div>
</RevealOnScroll>

// Manual com viewport
import { VIEWPORT } from '@/lib/motion-config'
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={VIEWPORT.default}
  transition={TRANSITION.slow}
>
  Content
</motion.div>
```

#### Reduced Motion (Acessibilidade)
```typescript
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { getTransition } from '@/lib/motion-config'

function MyComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={getTransition('elegant', prefersReducedMotion)}
    >
      Content
    </motion.div>
  )
}
```

---

## 3.5 ADMIN PANEL, AUTENTICAÇÃO E API

### Admin Panel (/app/admin)

Painel administrativo completo com autenticação, controle de acesso por roles e gestão de conteúdo.

#### Estrutura do Admin
```
/app/admin/
├── layout.tsx          # Layout com sidebar e header
├── page.tsx            # Dashboard principal
├── media/              # Biblioteca de mídia
│   └── page.tsx
├── posts/              # Gestão de posts (futuro)
├── users/              # Gestão de usuários (futuro)
└── settings/           # Configurações (futuro)
```

#### Componentes Admin
```typescript
// AdminHeader - Header do painel com usuário logado
import { AdminHeader } from '@/components/admin/AdminHeader'

// MediaUpload - Upload de arquivos com drag & drop
import { MediaUpload } from '@/components/admin/MediaUpload'

// MediaGrid - Grid de mídia com preview
import { MediaGrid } from '@/components/admin/MediaGrid'

// MediaPreview - Modal de preview com detalhes
import { MediaPreview } from '@/components/admin/MediaPreview'

// MediaFilters - Filtros de mídia (tipo, data, etc)
import { MediaFilters } from '@/components/admin/MediaFilters'
```

### Sistema de Autenticação

Autenticação baseada em sessões com Prisma database.

#### Login Flow
```typescript
// 1. Usuário submete credenciais em /login
POST /api/auth/login
{
  "email": "admin@asof.org.br",
  "password": "Admin123!@#"
}

// 2. Backend valida com bcrypt
const isValid = await bcrypt.compare(password, user.password)

// 3. Cria sessão no banco de dados
const session = await prisma.session.create({
  data: {
    sessionToken: authToken,
    userId: user.id,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
  }
})

// 4. Retorna cookie HTTP-only
response.cookies.set('admin-auth-token', authToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 dias
})
```

#### Proteção de Rotas
```typescript
// Middleware ou check manual em páginas admin
const authToken = cookies().get('admin-auth-token')
if (!authToken) {
  redirect('/login')
}

const session = await prisma.session.findUnique({
  where: { sessionToken: authToken.value },
  include: { user: true }
})

if (!session || session.expires < new Date()) {
  redirect('/login')
}
```

#### Roles e Permissões
```typescript
enum UserRole {
  SUPER_ADMIN  // Acesso total ao sistema
  ADMIN        // Gerenciar conteúdo e usuários
  EDITOR       // Editar e publicar conteúdo
  AUTHOR       // Criar e editar próprio conteúdo
  VIEWER       // Apenas visualização
}

// Verificar role
if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
  return { error: 'Sem permissão' }
}
```

#### Segurança
- ✅ Senhas hasheadas com bcrypt (salt rounds: 12)
- ✅ Failed login tracking (5 tentativas = bloqueio 30min)
- ✅ Account locking automático
- ✅ Audit logging de todas as ações
- ✅ HTTP-only cookies (não acessíveis via JavaScript)
- ✅ CSRF protection via SameSite
- ✅ IP address e user agent tracking

### REST API Routes

API completa para operações CRUD.

#### Autenticação
```bash
POST   /api/auth/login     # Login com email/senha
POST   /api/auth/logout    # Logout (invalida sessão)
```

#### Posts
```bash
GET    /api/posts          # Listar todos os posts
POST   /api/posts          # Criar novo post
GET    /api/posts/[slug]   # Buscar post por slug
PUT    /api/posts/[slug]   # Atualizar post
DELETE /api/posts/[slug]   # Deletar post (soft delete)
```

#### Media
```bash
GET    /api/media          # Listar mídia
POST   /api/media/upload   # Upload de arquivo
GET    /api/media/[id]     # Buscar mídia por ID
PUT    /api/media/[id]     # Atualizar metadata
DELETE /api/media/[id]     # Deletar mídia
```

#### Categories
```bash
GET    /api/categories     # Listar categorias
POST   /api/categories     # Criar categoria
PUT    /api/categories/[id] # Atualizar categoria
DELETE /api/categories/[id] # Deletar categoria
```

#### Padrão de Resposta
```typescript
// Sucesso
{
  "success": true,
  "data": { ... }
}

// Erro
{
  "error": "Mensagem de erro",
  "details": { ... } // Opcional
}
```

---

## 4. SISTEMA DE BLOG (MDX)

### Estrutura de Artigos

Artigos estão em `/content/noticias/*.mdx`:

```mdx
---
title: "Título do Artigo"
date: "2024-11-16"
category: "Categoria"
excerpt: "Resumo breve do artigo"
author: "Nome do Autor"
image: "/images/article.jpg"
---

# Conteúdo em Markdown

Parágrafo com **bold** e _italic_.

Componentes React customizados também funcionam!
```

### Frontmatter Obrigatório

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `title` | string | Título do artigo |
| `date` | string | Data (ISO format: YYYY-MM-DD) |
| `category` | string | Categoria (ex: "Notícias") |
| `excerpt` | string | Resumo para listagens |
| `author` | string | Autor do artigo |
| `image` | string | URL da imagem destacada |

### Reading Time

Calculado automaticamente com `reading-time` package:

```typescript
import { readingTime } from 'reading-time'
const time = readingTime(content)
// Resultado: { minutes: 5, words: 1200, ... }
```

### Renderização de Notícias

```typescript
// app/noticias/[slug]/page.tsx
import { allPosts } from '@/lib/mdx'

export default function ArticlePage({ params: { slug } }) {
  const post = allPosts.find(p => p.slug === slug)
  // Renderizar post.content (JSX)
}
```

---

## 5. ESTRUTURA DE PÁGINAS

### App Router Pattern

```typescript
// app/[pagina]/page.tsx (exemplo: /sobre)
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quem Somos',
  description: 'Conheça a ASOF...',
  openGraph: {
    title: 'Quem Somos',
    description: '...',
  },
}

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <ContentSection />
      <CTASection />
    </>
  )
}
```

### Páginas Principais

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `app/page.tsx` | Homepage com hero, sobre, pilares, notícias, CTA |
| `/sobre` | `app/sobre/page.tsx` | Quem somos, história, valores, diretoria |
| `/atuacao` | `app/atuacao/page.tsx` | Áreas de atuação, benefícios, cases |
| `/noticias` | `app/noticias/page.tsx` | Listagem de artigos do blog |
| `/noticias/[slug]` | `app/noticias/[slug]/page.tsx` | Artigo individual (MDX) |
| `/transparencia` | `app/transparencia/page.tsx` | Documentos, demonstrações financeiras |
| `/contato` | `app/contato/page.tsx` | Formulário, FAQ, mapa |
| `/convenios` | `app/convenios/page.tsx` | Convênios e parcerias |
| `/membros` | `app/membros/page.tsx` | Membros e diretoria |
| `/eventos` | `app/eventos/page.tsx` | Eventos e agendas |
| `/revista` | `app/revista/page.tsx` | Publicações e revistas |

---

## 6. COMPONENTES E SISTEMA DE DESIGN

### Componentes Base (`/components/ui/`)

#### Button
```typescript
<Button variant="primary" size="md">Clique aqui</Button>

// Variantes: primary | outline | highlight | ghost
// Tamanhos: sm | md | lg
// Supports asChild prop (via @radix-ui/react-slot)
```

#### Card
```typescript
<Card className="...">
  <div>Conteúdo do card</div>
</Card>
```

#### Badge
```typescript
<Badge>Categoria</Badge>
// Mostra categoria com fundo destacado
```

#### NewsCard
```typescript
<NewsCard
  date="2024-11-16"
  category="Notícias"
  title="Título"
  image="/img.jpg"
  slug="titulo-slug"
  excerpt="Resumo..."
/>
```

#### Container & Section
```typescript
<Container>           {/* max-width com padding */}
  <Section id="about">  {/* Section com heading opcional */}
    Conteúdo
  </Section>
</Container>
```

### Layout Components (`/components/layout/`)

#### Header
- Scroll detection com `useScrollPosition`
- Sticky quando scrollado
- Menu responsivo com MobileMenu em mobile

#### Footer
- Links organizados por coluna
- Informações de contato
- Social media links

#### MobileMenu
- Menu toggle para mobile
- Smooth transitions
- Fecha ao clicar em link

---

## 7. COMMANDS & SCRIPTS

### Desenvolvimento

```bash
# Iniciar dev server (http://localhost:3000)
npm run dev

# Build para produção
npm run build

# Rodar servidor de produção
npm start

# Linting
npm run lint
```

### Testes E2E (Playwright)

```bash
# Instalar navegadores
npm run test:install

# Rodar todos os testes
npm run test:e2e

# UI interativa para debug
npm run test:e2e:ui

# Modo headed (ver navegador)
npm run test:e2e:headed

# Debug detalhado
npm run test:e2e:debug

# Testes por browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Testes mobile
npm run test:e2e:mobile

# Testes por categoria
npm run test:a11y        # Acessibilidade
npm run test:performance # Performance

# Visualizar relatório
npm run test:report
```

### Database (Prisma)

```bash
# Gerar Prisma Client
npm run db:generate

# Criar e aplicar migration
npm run db:migrate

# Aplicar migrations (produção)
npm run db:migrate:deploy

# Popular com dados iniciais
npm run db:seed

# Abrir Prisma Studio (GUI)
npm run db:studio

# Resetar banco (⚠️ apaga tudo!)
npm run db:reset

# Push schema sem migrations
npm run db:push

# Pull schema do banco
npm run db:pull
```

---

## 8. CONFIGURAÇÕES CRÍTICAS

### next.config.ts

- **MDX Support**: Habilitado via `@next/mdx`
- **Image Optimization**: AVIF/WebP com cache de 1 ano
- **Security Headers**: HSTS, CSP, X-Frame-Options
- **Compression**: Gzip habilitado
- **Tree-shaking**: Otimizado para lucide-react, clsx, tailwind-merge
- **Console Removal**: console.log removido em produção

### tailwind.config.ts

- **Custom Colors**: primary, accent, neutral
- **Custom Spacing**: 8pt grid system
- **Custom Font Family**: serif (Playfair) e sans (Inter)
- **Custom Animations**: fade-in, fade-in-up
- **Max-width prose**: 65 caracteres (ideal para leitura)

### playwright.config.ts

- **Test Directory**: `./e2e`
- **Timeout**: 30 segundos
- **Workers**: 3 (otimizado para 8GB RAM M3)
- **Base URL**: `http://localhost:3001`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Relatórios**: HTML, JSON, Lista no terminal
- **Screenshots/Videos**: Apenas em falhas (economizar recursos)

### tsconfig.json

- **Target**: ES2020
- **Module**: esnext
- **Strict Mode**: Completo ativado
- **Path Aliases**: `@/*` mapeia para raiz do projeto
- **skipLibCheck**: true

---

## 9. VARIÁVEIS DE AMBIENTE

Ver `.env.example` para lista completa. Principais:

```bash
# Build
NODE_ENV=production
NEXT_PUBLIC_VERCEL_ENV=production

# Analytics (automático no Vercel)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=true

# Database (quando implementado)
DATABASE_URL="postgresql://user:pass@host:5432/asof"

# NextAuth (para CMS futuro)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Email (para notificações)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email"
SMTP_PASS="app-password"
```

---

## 10. TESTES E2E (PLAYWRIGHT)

### Estrutura de Testes

```
e2e/
├── pages/              # Page Object Models
│   ├── base.page.ts    # BasePage com elementos comuns
│   ├── home.page.ts    # HomePage
│   ├── news.page.ts    # News listing
│   └── ...
├── tests/
│   ├── static/         # Testes de páginas estáticas
│   ├── news/           # Testes do sistema de notícias
│   ├── accessibility/  # Testes WCAG 2.1 AA (axe-core)
│   ├── performance/    # Core Web Vitals
│   └── cross-browser.spec.ts
└── fixtures/           # Dados de teste
```

### Escrevendo Testes

```typescript
// ✅ BOM - Usar Page Objects
import { HomePage } from '../pages'

test('deve carregar homepage', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await expect(homePage.heroTitle).toBeVisible()
})

// ✅ BOM - Seletores por role/texto
await page.getByRole('button', { name: 'Enviar' }).click()
await page.getByText('Bem-vindo').waitFor()

// ❌ EVITAR - Seletores frágeis
await page.locator('div > div > p:nth-child(3)').click()
```

### Metas de Qualidade

- **Coverage**: Todas as páginas principais testadas
- **Performance**: LCP < 2.5s, CLS < 0.1, INP < 100ms
- **Acessibilidade**: WCAG 2.1 AA 100% compliance
- **Cross-browser**: Chrome, Firefox, Safari, Mobile

---

## 11. DEPLOYMENT (VERCEL)

### Pre-deploy Checklist

- [ ] `npm run lint` - Sem erros
- [ ] `npm run build` - Build sem erros
- [ ] `npm run test:e2e` - Todos os testes passando
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Images e assets otimizadas

### Deploy Automático

O GitHub Actions executa testes E2E automaticamente em:
- Push para `main`
- Pull Requests
- Manualmente via `workflow_dispatch`

Se todos os testes passarem, deploy automático no Vercel.

---

## 12. DATABASE & PRISMA (**ATIVO**)

### Status Atual

O banco de dados PostgreSQL com Prisma está **ATIVO** e sendo usado para:

- ✅ **Autenticação e sessões** - Login/logout de usuários admin
- ✅ **Admin panel** - Painel administrativo completo
- ✅ **Biblioteca de mídia** - Upload e gestão de arquivos
- ✅ **Audit logging** - Rastreamento de todas as ações
- ✅ **Gestão de usuários** - Roles e permissões
- ✅ **Posts** - Coexiste com MDX (futuro CMS dinâmico)
- ⏳ **Comentários** - Schema pronto, não implementado
- ⏳ **Documentos** - Schema pronto, não implementado

### Configuração Inicial

```bash
# Primeira configuração
npm run db:generate          # Gera Prisma Client
npm run db:migrate           # Cria tabelas no banco
npm run db:seed              # Popula com dados iniciais

# Acessar o banco
npm run db:studio            # Abre Prisma Studio (localhost:5555)
```

### Credenciais Admin Padrão (Seed)

```
Email: admin@asof.org.br
Password: Admin123!@#
Role: SUPER_ADMIN
Status: ACTIVE
```

**⚠️ IMPORTANTE**: Altere a senha padrão em produção!

### Variáveis de Ambiente Necessárias

```bash
# .env.local ou .env
DATABASE_URL="postgresql://user:password@host:5432/asof"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### Modelos Principais

| Modelo | Propósito | Status |
|--------|-----------|--------|
| `User` | Usuários do CMS com roles (SUPER_ADMIN, ADMIN, EDITOR, AUTHOR, VIEWER) | ✅ Ativo |
| `Session` | Sessões de autenticação (7 dias de validade) | ✅ Ativo |
| `Media` | Biblioteca de mídia com storage references | ✅ Ativo |
| `AuditLog` | Log completo de ações (CREATE, UPDATE, DELETE, LOGIN, etc) | ✅ Ativo |
| `Post` | Artigos e notícias com versionamento | ✅ Ativo |
| `Category` | Categorias hierárquicas | ✅ Ativo |
| `Tag` | Tags para classificação | ✅ Ativo |
| `Page` | Páginas estáticas (Sobre, Contato, etc) | ⏳ Pronto |
| `Comment` | Sistema de comentários | ⏳ Pronto |
| `Document` | Documentos para transparência | ⏳ Pronto |
| `Setting` | Configurações do sistema (key-value) | ⏳ Pronto |

### Uso no Código

```typescript
// Importar Prisma Client
import prisma from '@/lib/prisma'

// Buscar usuário
const user = await prisma.user.findUnique({
  where: { email: 'admin@asof.org.br' }
})

// Criar sessão
const session = await prisma.session.create({
  data: {
    sessionToken: token,
    userId: user.id,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
})

// Registrar ação no audit log
await prisma.auditLog.create({
  data: {
    action: 'LOGIN',
    entityType: 'User',
    entityId: user.id,
    userId: user.id,
    description: `Login bem-sucedido: ${user.email}`,
  }
})
```

### Migrations

```bash
# Criar nova migration
npm run db:migrate

# Aplicar migrations em produção
npm run db:migrate:deploy

# Reset completo (⚠️ deleta todos os dados!)
npm run db:reset
```

### Prisma Studio

GUI visual para explorar e editar dados:
```bash
npm run db:studio
# Abre em http://localhost:5555
```

Ver `/docs/database-*.md` para documentação completa do schema e otimizações.

---

## 13. PERFORMANCE & SEO

### Web Vitals Monitored

- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **INP** (Interaction to Next Paint): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅
- **FCP** (First Contentful Paint): < 1.8s ✅

Implementado via Vercel Analytics + Speed Insights.

### Otimizações Implementadas

```typescript
// 1. Server Components por padrão
export default function Page() { ... }

// 2. Image optimization
import Image from 'next/image'
<Image src="..." alt="..." width={400} height={300} />

// 3. Font optimization
import { inter, playfair } from '@/lib/fonts'

// 4. Dynamic imports (code splitting)
import dynamic from 'next/dynamic'
const HeavyComponent = dynamic(() => import('...'), { 
  loading: () => <p>Carregando...</p> 
})

// 5. Lazy loading nativo
<img loading="lazy" alt="..." />

// 6. Link prefetching automático (Next.js)
<Link href="/about">Sobre</Link>
```

### SEO Best Practices

- ✅ Metadata completa em todas as páginas
- ✅ Open Graph e Twitter Cards configurados
- ✅ Sitemap automático: `/sitemap.xml`
- ✅ Robots.txt: `/robots.txt`
- ✅ Structured Data pronto para JSON-LD
- ✅ Semantic HTML
- ✅ Alt text descritivos em imagens
- ✅ Mobile-friendly e responsivo

---

## 14. ACESSIBILIDADE

Conformidade com **WCAG 2.1 AA**:

### Implementado

- ✅ Semantic HTML (nav, main, header, footer, section)
- ✅ ARIA labels completos em botões/ícones
- ✅ Navegação por teclado (Tab, Enter, Escape)
- ✅ Focus indicators visíveis
- ✅ Contraste mínimo 4.5:1 (AA)
- ✅ Button heights mínimo 44-48px (mobile-friendly)
- ✅ Alt text descritivos em images
- ✅ Links com texto descritivo (não "clique aqui")

### Testado

```bash
# Testes de acessibilidade com axe-core
npm run test:a11y

# Verifica: WCAG 2.1 AA, contraste, landmarks, etc
```

---

## 15. BOAS PRÁTICAS & PADRÕES

### Error Handling

```typescript
// ✅ BOM - Tratamento explícito
try {
  const data = await fetchData()
} catch (error) {
  if (error instanceof Error) {
    console.error('Erro:', error.message)
  }
  return <ErrorFallback />
}

// ❌ EVITAR - Erros silenciosos
try {
  await fetchData()
} catch (e) {
  // silêncio...
}
```

### Data Fetching

```typescript
// ✅ BOM - Server Component (sem cliente library)
async function Page() {
  const data = await fetch('...')
  return <div>{data}</div>
}

// ✅ BOM - Client Component com dados passados por props
'use client'
function Component({ initialData }) {
  return <div>{initialData}</div>
}

// ❌ EVITAR - Client Component com fetch (race conditions)
'use client'
function Component() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch(...).then(setData) // Race condition!
  }, [])
}
```

### Conditional Rendering

```typescript
// ✅ BOM
{isLoading && <LoadingSpinner />}
{isError && <ErrorMessage />}
{data && <Content data={data} />}

// ❌ EVITAR - Renderizar condicionalmente hooks
{showComponent && <ClientComponent /> }  // ❌ Condicional
{condition && useState() }                // ❌ Condicional
```

### Object/Array Keys em Listas

```typescript
// ✅ BOM - ID único
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// ❌ EVITAR - Index como key (causa bugs em reorder)
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}
```

---

## 16. RESOLUÇÃO DE PROBLEMAS COMUNS

### "Use client" é necessário?

Regra simples:
- Precisa de `useState`, `useEffect`, `useContext`? → `"use client"`
- Precisa de `async/await`, database? → Mantenha como Server Component
- Só JSX puro? → Pode ser Server Component (mais eficiente)

### TypeScript Error: "Property does not exist"

```typescript
// ✅ Solução: Adicionar tipo
interface Props {
  title: string
}

function Component({ title }: Props) {
  // ✅ title é string
}
```

### Tailwind Classes Não Aplicadas

```typescript
// ❌ PROBLEMA: Classes dinâmicas não são detectadas
const className = `text-${size}`

// ✅ SOLUÇÃO: Usar interpolação apropriada
const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}
const className = sizes[size]
```

### Build Falha com Erros TypeScript

```bash
# ✅ Verificar tipos localmente antes de push
npm run build

# Se falhar, corrigir erros TypeScript
# Usar tipos explícitos e não 'any'
```

### E2E Tests Timeout

```typescript
// Aumentar timeout em playwright.config.ts
timeout: 30 * 1000,  // 30 segundos

// Ou em teste específico
test('meu teste', async ({ page }) => {
  await expect(element).toBeVisible({ timeout: 5000 })
})
```

---

## 17. DOCUMENTAÇÃO TÉCNICA INTERNA

Documentação detalhada para LLMs em `/docs/`:

| Arquivo | Conteúdo |
|---------|----------|
| `llm-project-overview.md` | Regras críticas do projeto |
| `llm-nextjs-15-app-router.md` | Server/Client Components patterns |
| `llm-typescript-strict.md` | Tipagem rigorosa, utility types |
| `llm-react-19-patterns.md` | Componentes, hooks, state |
| `llm-tailwindcss-customization.md` | Sistema de design, customizações |
| `llm-mdx-integration.md` | Blog, frontmatter, markdown |
| `llm-e2e-testing.md` | Playwright, Page Objects, CI/CD |
| `database-schema.md` | Schema ER completo |
| `database-performance.md` | Otimizações, índices, caching |
| `database-implementation.md` | Guia passo a passo |

**LEITURA OBRIGATÓRIA** antes de modificações significativas.

---

## 18. ESTRUTURA DE COMMITS

Seguir padrão Conventional Commits:

```
<tipo>: <descrição>

<corpo opcional>
<footer opcional>
```

### Tipos Aceitos

- `feat:` Nova feature
- `fix:` Bug fix
- `docs:` Documentação
- `style:` Formatação (sem lógica)
- `refactor:` Refatoração de código
- `perf:` Otimização de performance
- `test:` Testes
- `chore:` Dependências, configurações

### Exemplos

```bash
git commit -m "feat: adiciona página de membros"
git commit -m "fix: corrige scroll detection no header"
git commit -m "docs: atualiza guia de banco de dados"
git commit -m "perf: otimiza imagens da homepage"
```

---

## 19. TROUBLESHOOTING RÁPIDO

### Problema: "next dev" não inicia

```bash
# Verificar porta 3000
lsof -i :3000

# Limpar cache Next.js
rm -rf .next

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Reintentar
npm run dev
```

### Problema: Build falha

```bash
# Verificar erros TypeScript
npm run build --verbose

# Se for erro de import, verificar path aliases
# tsconfig.json: "@/*" deve mapear corretamente
```

### Problema: Prisma não gera Client

```bash
npm run db:generate

# Se continuar falhando
rm -rf node_modules/.prisma
npm install
npm run db:generate
```

### Problema: E2E tests falhando localmente mas passou no CI

- Adicionar waits explícitas: `await page.waitForLoadState('networkidle')`
- Aumentar timeout
- Verificar diferenças de resolução (viewport)
- Verificar timezone/locale (Playwright config tem pt-BR)

---

## 20. RECURSOS & LINKS

### Documentação Oficial

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Playwright Docs](https://playwright.dev)
- [MDX Docs](https://mdxjs.com)

### Repositório

- **Main**: Código de produção
- **Docs**: Documentação técnica em `/docs/`
- **Issues**: Bugs e feature requests
- **PRs**: Pull requests com testes E2E obrigatórios

---

## 21. CHECKLIST PRE-IMPLEMENTAÇÃO

Antes de qualquer mudança significativa:

- [ ] Ler `/docs/llm-project-overview.md`
- [ ] Confirmar se é Server ou Client Component
- [ ] Verificar TypeScript: tipos explícitos obrigatórios
- [ ] Testar localmente: `npm run dev` + `npm run test:e2e`
- [ ] Linting sem erros: `npm run lint`
- [ ] Build sem erros: `npm run build`
- [ ] Atualizar documentação se necessário
- [ ] Commit com padrão Conventional Commits
- [ ] Push com testes E2E passando

---

## 22. INFORMAÇÕES DE CONTATO & SUPORTE

**Projeto**: ASOF - Associação dos Oficiais de Chancelaria  
**Site**: https://asof.org.br  
**Email**: contato@asof.org.br  
**Telefone**: +55 (61) 3322-0000  

Documentação técnica mantida neste arquivo e em `/docs/`.

---

**Última Atualização**: 16 de Novembro, 2024  
**Versão**: 1.0.0  
**Mantenedor**: Gabriel Ramos (Gabriel Ramos <dev@gabrielramos.dev>)

**Lembrete**: Priorize sempre **Server Components**, **TypeScript strict**, **acessibilidade** e **performance**.
