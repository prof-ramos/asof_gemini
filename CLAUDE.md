# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

**ASOF Website** - Next.js 15 institutional website with full-featured CMS admin panel, authentication system, REST API, MDX blog integration, Prisma database, Framer Motion animations, and comprehensive Playwright E2E tests.

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

**Admin Panel & CMS**: Full-featured admin dashboard at `/app/admin`:
- Sidebar navigation with dashboard, media, posts, users, settings
- Authentication-protected routes with session management
- Media library with upload, preview, filtering capabilities
- Admin components: `AdminHeader`, `MediaUpload`, `MediaGrid`, `MediaPreview`, `MediaFilters`
- Role-based access control (SUPER_ADMIN, ADMIN, EDITOR, AUTHOR, VIEWER)

**Authentication System**: Secure session-based authentication:
- Login/logout API routes at `/app/api/auth/`
- Prisma database session storage with 7-day expiry
- bcrypt password hashing with salt rounds
- Failed login tracking with automatic account locking (5 attempts = 30min lock)
- Audit logging for all authentication events
- HTTP-only cookies for secure token storage
- IP address and user agent tracking

**REST API Routes**: Comprehensive API at `/app/api/`:
- `/api/auth/login` - User authentication
- `/api/auth/logout` - Session termination
- `/api/posts` - Post CRUD operations
- `/api/posts/[slug]` - Individual post management
- `/api/media` - Media library management
- `/api/media/upload` - File upload handling
- `/api/media/[id]` - Media item operations
- `/api/categories` - Category management

**Framer Motion Integration**: Centralized animation system in `/lib/motion-config.ts`:
- Easing functions: elegant, smooth, spring, sharp, easeOut, easeIn
- Duration tokens: instant, fast, quick, normal, slow, elegant, verySlow
- Stagger delays: sm (0.05s), md (0.1s), lg (0.15s), xl (0.2s)
- Viewport configurations for scroll-triggered animations
- Reduced motion support for accessibility
- Pre-configured transitions for common use cases
- Motion variants in `/lib/motion-variants.ts`
- `RevealOnScroll` component for scroll animations

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

# Run specific test file or test
npx playwright test e2e/tests/static/homepage.spec.ts           # Single file
npx playwright test -g "should load homepage"                   # By test name
npx playwright test e2e/tests/static/homepage.spec.ts --headed  # Watch test run
```

### Database (Prisma - Active)
```bash
npm run db:generate            # Generate Prisma Client
npm run db:migrate             # Create and apply migration
npm run db:migrate:deploy      # Apply migrations in production
npm run db:studio              # Open Prisma Studio GUI
npm run db:seed                # Seed database with initial data
npm run db:reset               # Reset database (⚠️ deletes all data)
npm run db:push                # Push schema without migrations
npm run db:pull                # Pull schema from database
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

### Core Configuration
- `/app/layout.tsx`: Root layout with metadata, Analytics, SpeedInsights, Header, Footer
- `/next.config.ts`: Next.js configuration with MDX, bundle analyzer, security headers
- `/prisma/schema.prisma`: Complete database schema (20+ models) - **ACTIVELY USED**
- `/prisma/seed.ts`: Database seeding script with admin user and test data

### Library & Utilities
- `/lib/design-tokens.ts`: Centralized spacing, button heights, icon sizes (8pt grid)
- `/lib/motion-config.ts`: Framer Motion easing, durations, stagger, viewport configs
- `/lib/motion-variants.ts`: Reusable animation variants for components
- `/lib/color-combinations.ts`: WCAG-validated color pairings with contrast ratios
- `/lib/fonts.ts`: Optimized Google Fonts (Playfair Display + Inter)
- `/lib/mdx.ts`: Functions to read/parse MDX blog posts
- `/lib/prisma.ts`: Prisma Client singleton instance
- `/lib/performance.ts`: Web Vitals tracking and performance monitoring
- `/lib/utils.ts`: Utility functions (cn, formatDate, etc)
- `/lib/constants.ts`: Site configuration and navigation items

### Components
- `/components/ui/`: Reusable components (Button, Card, Badge, NewsCard, etc)
- `/components/layout/`: Header (with scroll detection), Footer, MobileMenu
- `/components/admin/`: Admin panel components (AdminHeader, MediaUpload, MediaGrid, MediaPreview, MediaFilters)
- `/components/effects/`: Animation components (RevealOnScroll)
- `/components/sections/`: Homepage sections (Hero, About, Pillars, News, CTA)

### Hooks
- `/hooks/ui/useScrollPosition.ts`: Scroll position detection for header
- `/hooks/useWebVitals.ts`: Web Vitals tracking hook
- `/hooks/useMousePosition.ts`: Mouse position tracking
- `/hooks/useReducedMotion.ts`: Accessibility hook for animation preferences
- `/hooks/index.ts`: Barrel exports for all hooks

### Pages & Routes
- `/app/admin/`: Admin panel dashboard and pages (protected routes)
- `/app/api/`: REST API routes (auth, posts, media, categories)
- `/app/login/`: Login page for admin authentication
- `/app/noticias/`: News listing and individual article pages (MDX)
- `/app/[page]/`: Static pages (sobre, atuacao, contato, transparencia, etc)

### Testing
- `/e2e/pages/`: Page Object Models for E2E tests
- `/e2e/tests/`: Test suites (static, news, admin, accessibility, performance)
- `/e2e/tests/admin/login.spec.ts`: Admin authentication tests
- `/e2e/fixtures/`: Test data and fixtures

### Content
- `/content/noticias/`: MDX blog posts with frontmatter metadata

## Database Architecture (Prisma - ACTIVE)

The project uses **PostgreSQL with Prisma ORM** for the admin panel, authentication, and CMS features. The public blog still uses MDX files for performance, but the admin system is fully database-driven.

**Currently Active Features**:
- ✅ User authentication and session management
- ✅ Admin panel with role-based access control
- ✅ Media library with database references
- ✅ Audit logging for all admin actions
- ✅ Post management (coexists with MDX)
- ✅ Category and tag management
- ⏳ Comment system (schema ready, not implemented)
- ⏳ Document management (schema ready, not implemented)

**Key Models in Use**:
- `User`: Admin users with roles (SUPER_ADMIN, ADMIN, EDITOR, AUTHOR, VIEWER)
- `Session`: Authentication sessions with 7-day expiry
- `Media`: Uploaded files with metadata and storage references
- `Post`: Blog posts (can coexist with MDX files)
- `Category`: Hierarchical categorization
- `Tag`: Content tagging system
- `AuditLog`: Complete audit trail of all actions
- `Setting`: System configuration key-value store

**Database Setup**:
```bash
# First time setup
npm run db:generate          # Generate Prisma Client
npm run db:migrate           # Create tables
npm run db:seed              # Create admin user and test data

# Accessing the database
npm run db:studio            # Open Prisma Studio GUI (localhost:5555)
```

**Default Admin Credentials** (from seed):
```
Email: admin@asof.org.br
Password: Admin123!@#
Role: SUPER_ADMIN
```

**Environment Variables Required**:
```bash
DATABASE_URL="postgresql://user:password@host:5432/asof"
NEXTAUTH_SECRET="your-secret-key-here"
```

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

## Framer Motion Usage Patterns

### Basic Animation
```typescript
import { motion } from 'framer-motion'
import { TRANSITION, EASING, DURATION } from '@/lib/motion-config'

// Simple fade-in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={TRANSITION.default}
>
  Content
</motion.div>

// Slide up with custom timing
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: DURATION.slow, ease: EASING.elegant }}
>
  Content
</motion.div>
```

### Scroll-Triggered Animations
```typescript
import { RevealOnScroll } from '@/components/effects/RevealOnScroll'

// Using the RevealOnScroll component
<RevealOnScroll variant="fadeInUp">
  <div>Content that animates on scroll</div>
</RevealOnScroll>

// Or manually with viewport
import { VIEWPORT } from '@/lib/motion-config'
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={VIEWPORT.default}
>
  Content
</motion.div>
```

### Stagger Children
```typescript
import { STAGGER, DURATION } from '@/lib/motion-config'

<motion.ul
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: STAGGER.md,
      },
    },
  }}
>
  {items.map((item) => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Reduced Motion Support
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

## Common Pitfalls to Avoid

1. **Adding `"use client"` unnecessarily**: Most components should be Server Components
2. **Using arbitrary Tailwind values**: Check `/lib/design-tokens.ts` first
3. **Skipping TypeScript types**: Strict mode will fail builds
4. **Buttons smaller than 44px**: Violates accessibility guidelines
5. **Text smaller than 12px**: WCAG violation
6. **Forgetting ARIA labels**: All icons and icon-only buttons need aria-label
7. **Using CSS selectors in tests**: Use `getByRole()`, `getByText()` instead
8. **Not testing on mobile**: Run `npm run test:e2e:mobile`
9. **Committing sensitive files**: Never commit `.env`, `.gemini_security/`, or files with credentials

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

## Environment Variables

**Note**: `DATABASE_URL` is required only when using Prisma/database features (currently optional, as the project uses MDX instead). Analytics and SMTP variables are optional/configurable - see `.env.development.local` for full defaults and examples.

Critical environment variables (see `.env.example` for full list):

```bash
# Database (Prisma) - Required when using database features (currently optional, MDX-only)
DATABASE_URL="postgresql://user:pass@host:5432/asof"

# Analytics (auto-configured on Vercel) - Optional, enable for user insights and performance tracking
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=true

# Email (for contact form) - Optional, configure when contact form functionality is needed
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## CI/CD Pipeline

**GitHub Actions** automatically:
- Runs E2E tests on push to `main` and PRs
- Deploys to Vercel if all tests pass
- Can be triggered manually via `workflow_dispatch`

**Pre-commit checks**: Ensure `npm run lint` and `npm run build` pass locally.

## Platform-Specific Notes

**MacBook Air M3 (8GB RAM)**:
- Playwright workers limited to 3 for optimal performance
- E2E tests configured to avoid memory issues
- Use `npm run test:e2e:chromium` for faster single-browser testing during development

## Security & Performance Features

**Security headers** (configured in `next.config.ts`):
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

**Monitoring**:
- Vercel Analytics for user insights
- Vercel Speed Insights for real-time Core Web Vitals
- Web Vitals tracking via `/lib/performance.ts`

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
