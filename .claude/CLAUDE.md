# ASOF Website - Guia Técnico para Claude Code

## Visão Geral do Projeto

**Projeto**: Site Institucional ASOF - Associação dos Oficiais de Chancelaria  
**Framework**: Next.js 15 com App Router  
**Linguagem**: TypeScript (strict mode)  
**Estilização**: Tailwind CSS 3.4  
**Banco de Dados**: Prisma + PostgreSQL (preparado, não em uso no frontend)  
**Testes**: Playwright (E2E)  
**Deployment**: Vercel  

O projeto é um site institucional moderno com blog em MDX, testes E2E completos e um schema de banco de dados pronto para implementação de CMS/admin.

---

## 1. ARQUITETURA DO PROJETO

### Estrutura Geral

```
asof_gemini/
├── app/                      # App Router do Next.js (Server Components por padrão)
│   ├── layout.tsx           # Layout raiz com metadata, Header, Footer
│   ├── globals.css          # Estilos globais + Tailwind
│   ├── page.tsx             # Homepage
│   ├── [pasta]/page.tsx     # Páginas estáticas (sobre, atuacao, contato, etc)
│   └── noticias/
│       ├── page.tsx         # Listagem de notícias
│       └── [slug]/page.tsx  # Artigo individual (MDX)
│
├── components/
│   ├── ui/                  # Componentes reutilizáveis (Button, Card, Badge, etc)
│   ├── layout/              # Layout components (Header, Footer, MobileMenu)
│   ├── sections/            # Seções da homepage (Hero, About, Pillars, News, CTA)
│   └── mdx/                 # Componentes para renderização MDX
│
├── lib/
│   ├── utils.ts            # Funções utilitárias (cn, formatDate)
│   ├── constants.ts        # SITE_CONFIG, NAV_ITEMS, COLORS
│   ├── fonts.ts            # Playfair Display + Inter otimizadas
│   ├── design-tokens.ts    # Sistema de spacing, button heights, icon sizes
│   ├── color-combinations.ts # Paleta de cores e combinações
│   ├── mdx.ts              # Funções para processar MDX
│   ├── prisma.ts           # Prisma Client singleton
│   └── performance.ts      # Web Vitals e análise
│
├── hooks/
│   └── useScrollPosition.ts # Hook customizado para detecção de scroll
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
| **Blog** | MDX | 3.1.1 |
| **ORM** | Prisma | 5.22.0 |
| **Database** | PostgreSQL | 15+ |
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

## 12. DATABASE & PRISMA (OPCIONAL - PREPARADO)

### Status Atual

- ✅ Schema completo em `prisma/schema.prisma`
- ✅ Documentação em `/docs/database-*.md`
- ✅ Prisma Client configurado
- ⏳ Não integrado ao frontend (usando MDX por enquanto)

### Modelos Principais

| Modelo | Propósito |
|--------|-----------|
| `User` | Usuários do CMS com roles (ADMIN, EDITOR, AUTHOR) |
| `Post` | Artigos e notícias com versionamento |
| `Page` | Páginas estáticas (Sobre, Contato, etc) |
| `Category` | Categorias hierárquicas |
| `Tag` | Tags para classificação |
| `Media` | Biblioteca de mídia (imagens, vídeos) |
| `Comment` | Sistema de comentários (futuro) |
| `Document` | Documentos para transparência |
| `AuditLog` | Log de todas as ações |
| `Setting` | Configurações do sistema |

### Quando Usar

Ative o database quando:
1. Precisar de painel de administração
2. Migrar de MDX para CMS dinâmico
3. Implementar autenticação de usuários
4. Sistema avançado de mídia/documentos

Ver `PRISMA_SETUP.md` para setup completo.

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
