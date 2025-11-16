# LLM Project Overview - ASOF Website

## 🚀 Project Context

Este é o website institucional da ASOF (Associação dos Oficiais de Chancelaria) desenvolvido com **Next.js 15**, **React 19** e **TypeScript** em strict mode. O projeto segue arquitetura moderna com **App Router**, **Server Components** por padrão, e otimização extrema para performance e SEO.

## 📊 Technology Stack Summary

**Core Framework:**
- Next.js 15.1.8 (App Router)
- React 19.0.0 (Server Components by default)
- TypeScript 5 (strict mode + path aliases @/)

**Styling & Design:**
- TailwindCSS 3.4.1 (custom theme + fonts otimizadas)
- Responsive design (mobile-first)
- Palette personalizada ASOF

**Content Management:**
- MDX para blog/posts dinâmicos
- Next-MDX-Remote para rendering
- Gray-matter para frontmatter

**Testing & Quality:**
- Playwright E2E (multi-browser: Chromium, Firefox, WebKit)
- @axe-core/playwright para acessibilidade
- SEO validation integrada

**Deployment & Analytics:**
- Vercel otimizado
- @vercel/analytics + @vercel/speed-insights
- Web Vitals integrado

## 🏗️ Architecture Principles

### 1. Server First Architecture
- Server Components são o padrão
- Client Components apenas quando necessário (interatividade)
- Server-side data fetching sempre que possível

### 2. Strict Type Safety
- TypeScript strict mode sempre ativado
- No unused locals/parameters
- Path aliases obrigatórios (@/ para imports)

### 3. Performance First
- Font optimization (Next/font)
- Image optimization (Next/image + AVIF/WebP)
- Bundle splitting automático
- Lazy loading onde apropriado

### 4. SEO & Accessibility First
- Metadata API completa
- Open Graph + Twitter Cards
- ARIA labels completos
- WCAG 2.1 AA compliance

## 🎯 Critical LLM Guidelines

### ❌ NEVER DO THESE:
- Import client-only APIs em Server Components
- Usar hooks do React em Server Components
- Criar client components desnecessariamente
- Ignorar TypeScript strict mode
- Usar CSS inline (sempre Tailwind)
- Esquecer de otimizar imagens
- Criar componentes sem acessibilidade

### ✅ ALWAYS DO THESE:
- Usar Server Components por padrão
- Adicionar 'use client' apenas quando necessário
- Validar tipos TypeScript rigorosamente
- Otimizar fonts e imagens
- Seguir padrões AAC (ARIA + Keyboard)
- Manter bundle size baixo
- Testar em múltiplos browsers

## 🔧 Development Environment

- Node.js 18+
- TypeScript strict mode
- ESLint + Next.js rules
- Playwright para E2E
- VS Code recomendado

## 📁 File Structure (MANDATORY)

```
project/
├── app/                    # App Router (Server Components)
│   ├── layout.tsx         # Root layout (server)
│   ├── page.tsx          # Homepage (server)
│   ├── globals.css       # Tailwind + custom styles
│   └── [dynamic]/        # Dynamic routes
├── components/            # Reusable components
│   ├── ui/              # Base UI components
│   ├── sections/        # Page sections
│   └── layout/          # Layout components
├── lib/                  # Utilities + configurations
│   ├── fonts.ts         # Font loading optimization
│   ├── utils.ts         # Helper functions
│   └── mdx.ts           # MDX configuration
├── content/             # MDX content
├── e2e/                # E2E tests (Playwright)
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── public/             # Static assets
```

## 🚨 ERROR PREVENTION RULES

### Server vs Client Components:
```typescript
// ✅ CORRETO - Server Component (padrão)
export default function Page() {
  const data = await fetchData() // Fetch na server
  return <ClientComponent data={data} />
}

// ❌ ERRADO - Client Component desnecessário
'use client'
export default function Page() {
  const [data, setData] = useState() // State desnecessário
  return <div>...</div>
}
```

### Type Safety:
```typescript
// ✅ CORRETO - Strict typing
interface Props { title: string; date: Date }
export function NewsCard({ title, date }: Props) {
  return <div>{title} - {date.toLocaleDateString()}</div>
}

// ❌ ERRADO - Any types ou optional sem motivo
interface Props { data?: any }
export function Component({ data }: Props) {
  return <div>{data?.title}</div> // Unsafe access
}
```

### Image Optimization:
```typescript
// ✅ CORRETO - Next.js Image
import Image from 'next/image'
<Image src="/hero.jpg" alt="Hero" width={1920} height={1080} />

// ❌ ERRADO - HTML img ou next/image sem optimization
<img src="/hero.jpg" alt="Hero" /> // No responsive, no WebP
```

### ARIA Accessibility:
```typescript
// ✅ CORRETO - Full ARIA + Keyboard
<button
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  aria-label="Menu toggle"
  aria-expanded={isOpen}
>
  Menu
</button>

// ❌ ERRADO - Missing accessibility
<button onClick={handleClick}>Menu</button>
```

## 🎨 Design System Rules

### Colors (ASOF Palette):
- Primary: #040920 (azul escuro)
- Primary Dark: #0D2A4A (azul médio)
- Accent: #82b4d6 (azul claro)
- Neutral: #e7edf4 (azul muito claro)

### Typography:
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Mobile-friendly responsive sizing

### Spacing:
- Tailwind spacing scale (0.25rem increments)
- Mobile-first responsive breakpoints
- Consistent padding/margin patterns

## 🚀 Performance Rules

- Lighthouse Score target: 95+
- LCP: < 2.0s
- CLS: < 0.05
- Bundle JS: < 200KB
- Images: Always WebP/AVIF when possible

## 🔍 Testing Rules

- E2E tests cobrem: functionality, accessibility, performance
- Visual regression testing com screenshots
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile simulation obrigatória

## 📝 Content Rules

- MDX para conteúdo dinâmico (posts, páginas)
- Frontmatter obrigatório nos arquivos MDX
- Reading time calculation automática
- Related content suggestions

## 🚀 Deployment Rules

- Vercel automatic deployments
- Preview deployments para PRs
- Environment variables protegidas
- CDN optimization (Vercel Edge Network)

---

**REMINDER:** Always prefer Server Components, maintain strict TypeScript compliance, and follow accessibility standards. When in doubt, check for similar patterns in existing components first.
