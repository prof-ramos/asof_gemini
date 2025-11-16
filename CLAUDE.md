# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

**ASOF Website** - Next.js 15 institutional website using App Router with strict TypeScript, MDX blog, and Playwright E2E tests.

### Critical Architecture Patterns

**Server vs Client Components**: This is a Next.js 15 App Router project. Components are **Server Components by default**. Only add `"use client"` when you need:
- React hooks (`useState`, `useEffect`, `useContext`)
- Browser APIs (window, localStorage, etc)
- Event handlers (onClick, onChange, etc)

Server Components can:
- Be async functions
- Fetch data directly (no useState/useEffect needed)
- Access databases/APIs without client-side libraries
- Are more performant and SEO-friendly

**MDX Content System**: Blog posts live in `/content/noticias/*.mdx` with frontmatter metadata. The system uses:
- `gray-matter` for frontmatter parsing
- `next-mdx-remote` for rendering
- Static generation with `generateStaticParams()`
- Reading time calculated with `reading-time` package

**Design Tokens Centralization**: `/lib/design-tokens.ts` contains:
- `SPACING`: 8pt grid system (4px, 8px, 16px, 24px, 32px, 48px, 64px, 96px)
- `BUTTON_HEIGHTS`: Mobile-first (48px minimum for iOS/Android accessibility)
- `ICON_SIZES`: Proportional to text sizes (16-36px)
- Use these constants instead of arbitrary Tailwind values

**Accessibility-First**: WCAG 2.1 AA compliance enforced:
- Minimum button height: 48px on mobile, 44px on desktop
- Minimum text size: 12px (avoid smaller)
- All buttons/icons have ARIA labels
- Semantic HTML required (nav, main, header, footer, section, article)
- Color contrast minimum 4.5:1 validated in `/lib/color-combinations.ts`

## Common Commands

### Development
```bash
npm run dev                    # Start dev server (http://localhost:3000)
npm run build                  # Production build
npm start                      # Run production build
npm run lint                   # ESLint check
```

### Testing (Playwright E2E)
```bash
npm run test:install           # Install Playwright browsers (first time only)
npm run test:e2e               # Run all E2E tests
npm run test:e2e:ui            # Interactive UI mode for debugging
npm run test:e2e:headed        # See browser while testing
npm run test:e2e:debug         # Debug mode with step-by-step
npm run test:e2e:chromium      # Test only Chromium
npm run test:e2e:mobile        # Test mobile viewports
npm run test:a11y              # Accessibility tests only
npm run test:performance       # Performance tests only
npm run test:report            # View HTML test report
```

### Database (Prisma - Optional, not currently used)
```bash
npm run db:generate            # Generate Prisma Client
npm run db:migrate             # Create and apply migration
npm run db:studio              # Open Prisma Studio GUI
npm run db:seed                # Seed database with initial data
```

### Bundle Analysis
```bash
npm run analyze                # Analyze bundle size with webpack-bundle-analyzer
```

## Code Structure Patterns

### TypeScript Strict Mode
All code must satisfy strict TypeScript:
- **No implicit `any`**: Always type function parameters and return values
- **No unused variables**: Remove or prefix with `_` if intentionally unused
- Example:
```typescript
// ✅ Good
interface Props {
  title: string
  count: number
}
function Component({ title, count }: Props): React.ReactNode {
  return <div>{title}: {count}</div>
}

// ❌ Bad - implicit any
function Component({ title, count }) {
  return <div>{title}: {count}</div>
}
```

### Component Pattern
```typescript
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MyComponentProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function MyComponent({
  children,
  variant = 'primary',
  className,
}: MyComponentProps) {
  return (
    <div className={cn('base-classes', variantStyles[variant], className)}>
      {children}
    </div>
  )
}
```

### Styling with Tailwind
- Use `cn()` utility (clsx + tailwind-merge) for combining classes
- Design tokens from `/lib/design-tokens.ts` for consistency
- Never use arbitrary values when design tokens exist
```typescript
// ✅ Good - uses design tokens
import { BUTTON_HEIGHTS } from '@/lib/design-tokens'
<button className={cn('px-8', `h-[${BUTTON_HEIGHTS.mobile.md}]`)}>

// ❌ Bad - arbitrary values
<button className="px-8 h-[50px]">
```

### Page Structure (App Router)
```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
  openGraph: {
    title: 'Page Title',
    description: 'Description',
  },
}

export default function Page() {
  // Server Component - can be async
  return <div>Content</div>
}
```

### MDX Blog Post
Create `.mdx` files in `/content/noticias/`:
```mdx
---
title: "Article Title"
date: "2024-11-16"
category: "News"
excerpt: "Brief summary"
author: "Author Name"
image: "/images/article.jpg"
---

# Article Content

Your markdown content here with **bold** and _italic_.
```

## Testing Patterns

### E2E Test Structure (Playwright)
Use Page Object Model pattern:
```typescript
import { HomePage } from '../pages'

test('homepage loads correctly', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await expect(homePage.heroTitle).toBeVisible()
})
```

**Always use semantic selectors**:
```typescript
// ✅ Good - by role/text (resilient)
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByText('Welcome').waitFor()

// ❌ Bad - CSS selectors (brittle)
await page.locator('div > div > button:nth-child(3)').click()
```

## Critical Files & Their Purpose

- `/app/layout.tsx`: Root layout with metadata, Analytics, SpeedInsights, Header, Footer
- `/lib/design-tokens.ts`: Centralized spacing, button heights, icon sizes (8pt grid)
- `/lib/color-combinations.ts`: WCAG-validated color pairings with contrast ratios
- `/lib/fonts.ts`: Optimized Google Fonts (Playfair Display + Inter)
- `/lib/mdx.ts`: Functions to read/parse MDX blog posts
- `/components/ui/`: Reusable components (Button, Card, Badge, etc)
- `/components/layout/`: Header (with scroll detection), Footer, MobileMenu
- `/e2e/pages/`: Page Object Models for tests
- `/e2e/tests/`: Test suites (static, news, accessibility, performance)
- `/content/noticias/`: MDX blog posts
- `/prisma/schema.prisma`: Complete database schema (20+ models, not currently used)

## Database Architecture (Prisma - Future Use)

The project has a **complete Prisma schema** ready for CMS implementation but **not currently integrated**. The blog uses MDX files instead.

**When to activate database**:
- Need admin panel for content management
- Want to migrate from MDX to dynamic CMS
- Require user authentication/permissions
- Advanced media/document management needed

**Key models**: User (with roles), Post, Page, Category, Tag, Media, Document, AuditLog, Setting

See `prisma/schema.prisma` and `/docs/database-*.md` for complete documentation.

## Performance & Optimization

**Enforced optimizations**:
- Server Components by default (less JavaScript shipped)
- `next/image` for all images (automatic optimization to AVIF/WebP)
- `next/font` for fonts (self-hosted, no external requests)
- Static generation where possible (`generateStaticParams`)
- Tree-shaking enabled for lucide-react, clsx, tailwind-merge
- Console.log statements removed in production builds

**Monitored Web Vitals**:
- LCP < 2.5s
- INP < 100ms
- CLS < 0.1
- Via Vercel Analytics + Speed Insights

## Common Pitfalls to Avoid

1. **Adding `"use client"` unnecessarily**: Most components should be Server Components
2. **Using arbitrary Tailwind values**: Check `/lib/design-tokens.ts` first
3. **Skipping TypeScript types**: Strict mode will fail builds
4. **Buttons smaller than 44px**: Violates accessibility guidelines
5. **Text smaller than 12px**: WCAG violation
6. **Forgetting ARIA labels**: All icons and icon-only buttons need aria-label
7. **Using CSS selectors in tests**: Use `getByRole()`, `getByText()` instead
8. **Not testing on mobile**: Run `npm run test:e2e:mobile`

## Deployment

**Pre-deploy checklist**:
```bash
npm run lint              # Must pass
npm run build             # Must succeed
npm run test:e2e          # All tests must pass
```

**Vercel deployment**:
- GitHub Actions runs E2E tests automatically on push to `main`
- Auto-deploys to Vercel if tests pass
- Environment variables configured in Vercel dashboard

**Manual deployment**:
```bash
vercel --prod
```

## Additional Documentation

Comprehensive technical documentation for LLMs in `/docs/`:
- `llm-project-overview.md` - Critical project rules
- `llm-nextjs-15-app-router.md` - Server/Client Component patterns
- `llm-typescript-strict.md` - Strict typing guidelines
- `llm-react-19-patterns.md` - React 19 best practices
- `llm-tailwindcss-customization.md` - Design system details
- `llm-mdx-integration.md` - MDX blog system
- `llm-e2e-testing.md` - Playwright patterns and CI/CD
- `database-*.md` - Complete database documentation

**Read these before making significant changes.**

Full detailed guide also available in `.claude/CLAUDE.md` (1000+ lines).
