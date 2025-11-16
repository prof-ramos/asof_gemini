# Next.js 15 App Router - LLM Guide

## 🎯 IMMEDIATE CRITICAL RULES

### 1. Server Components are DEFAULT
```typescript
// ✅ ALWAYS DO THIS (Server Component by default)
export default function Page() {
  const data = await fetchData() // Direct data fetching
  return <div>{data.title}</div>
}

// ❌ NEVER DO THIS UNLESS ABSOLUTELY NECESSARY
'use client'
export default function Page() {
  // Only if you need hooks, events, or browser APIs
}
```

### 2. Client Components ONLY when needed
**Add `'use client'` ONLY for:**
- Event handlers (onClick, onSubmit)
- React Hooks (useState, useEffect, useContext)
- Browser-only APIs (localStorage, geolocation)
- Imperative DOM manipulation

**NEVER add `'use client'` for:**
- Data fetching
- Static content
- Pure components
- Layout components (unless they need hooks)

## 📁 File Structure MANDATORY

```
app/
├── layout.tsx           # Root layout (server component)
├── page.tsx            # Homepage (server component)
├── globals.css         # Global styles (link from layout.tsx)
├── loading.tsx         # Optional loading UI
├── error.tsx          # Error boundary page
├── not-found.tsx      # 404 page
│
├── (auth)/            # Route groups (don't affect URL)
├── [dynamic]/         # Dynamic routes
├── [...catchAll]/     # Catch-all routes
│
├── api/               # API routes
│   ├── users/route.ts
│   └── posts/[id]/route.ts
│
└── sitemap.ts         # Generate sitemap
```

## 🚀 App Router Patterns

### 1. Server Component Data Fetching
```typescript
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts() // Runs on server

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} /> // Pass data to client component
      ))}
    </div>
  )
}
```

### 2. Client Component with Server Data
```typescript
// components/PostCard.tsx
'use client'

type Props = {
  post: {
    id: string
    title: string
    likes: number
  }
}

export function PostCard({ post }: Props) {
  const [likes, setLikes] = useState(post.likes) // Client-only state

  return (
    <article>
      <h2>{post.title}</h2>
      <button onClick={() => setLikes(l >> 1)}>
        ❤️ {likes}
      </button>
    </article>
  )
}
```

### 3. Layout Composition (Server → Client)
```typescript
// app/layout.tsx (Server Component)
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>  {/* Client component for context */}
          <Header />      {/* Server component */}
          <main>{children}</main>
          <Footer />      {/* Server component */}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## 🔄 Migration Rules (Pages → App Router)

### From `getServerSideProps` → Server Component
```typescript
// pages/blog/[slug].tsx (OLD)
export async function getServerSideProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.slug}`)
  const post = await res.json()

  return { props: { post } }
}

export default function BlogPost({ post }) {
  return <div>{post.title}</div>
}

// app/blog/[slug]/page.tsx (NEW)
async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  return res.json()
}

export default async function BlogPost({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return <div>{post.title}</div>
}
```

### From `getStaticProps` → Static Generation
```typescript
// pages/blog/index.tsx (OLD)
export async function getStaticProps() {
  const posts = await fetchPosts()
  return { props: { posts } }
}

// app/blog/page.tsx (NEW)
async function getPosts() {
  return fetchPosts()
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}

// Static generation (optional)
export function generateStaticParams() {
  return [{ slug: 'post-1' }, { slug: 'post-2' }]
}
```

## 🎣 Hooks & Navigation (Client Only)

### Navigation Hooks (Client Components Only)
```typescript
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function NavigationComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleNavigate = () => {
    router.push('/dashboard') // Imperative navigation
  }

  return <button onClick={handleNavigate}>Go to Dashboard</button>
}
```

### Search Params (Server + Client Compatible)
```typescript
// Server Component - Read search params
import { Suspense } from 'react'

export default function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ query: string }>
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  )
}

// Client Component - Update search params
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export function SearchForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const updateQuery = (query: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('query', query)
    router.replace(`/search?${params}`)
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      updateQuery(e.target.query.value)
    }}>
      <input name="query" defaultValue={searchParams.get('query') || ''} />
    </form>
  )
}
```

## 🔗 Metadata API (App Router)

### Static Metadata
```typescript
// app/layout.tsx
export const metadata = {
  title: 'ASOF - Associação dos Oficiais de Chancelaria',
  description: 'Website institucional da ASOF',
  keywords: ['diplomacia', 'carreira', 'Itamaraty'],
  authors: [{ name: 'ASOF' }],
  openGraph: {
    title: 'ASOF',
    description: 'Associação dos Oficiais de Chancelaria',
    url: 'https://www.asof.org.br',
    siteName: 'ASOF',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASOF',
    description: 'Associação dos Oficiais de Chancelaria',
    images: ['/og-image.jpg'],
  },
}
```

### Dynamic Metadata
```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  const post = await fetchPost(slug)
  if (!post) notFound()
  return post
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: `${post.title} | ASOF Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

export default async function BlogPost({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return <PostContent post={post} />
}
```

## 🚨 ERROR PREVENTION

### ❌ Common Mistakes to Avoid:

1. **Using hooks in Server Components**
```typescript
// ❌ WRONG
export default function ServerPage() {
  const [state, setState] = useState() // ERROR: Hooks don't work in server components
  return <div />
}
```

2. **Importing client-only modules in Server Components**
```typescript
// ❌ WRONG
import { useRouter } from 'next/navigation' // ERROR: Client-only navigation

export default function ServerPage() {
  const router = useRouter() // This will fail
  return <div />
}
```

3. **Mixing Server and Client contexts incorrectly**
```typescript
// ❌ WRONG - Passing server context to client boundaries
'use client'
export function ClientComponent({ data }: { data: any }) {
  return <div>{JSON.stringify(data)}</div> // ERROR: Can't serialize server objects
}
```

4. **Not wrapping async components properly**
```typescript
// ❌ WRONG
export function AsyncComponent() {
  const data = await fetchData() // ERROR: Can't use await in function components
  return <div />
}
```

5. **Using dynamic imports incorrectly**
```typescript
// ❌ WRONG
import dynamic from 'next/dynamic'
const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false // This defeats the purpose of server components
})
```

### ✅ Correct Patterns:

1. **Server Component fetching data**
```typescript
// ✅ CORRECT
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <ClientComponent initialData={data} />
}
```

2. **Client Component for interactivity**
```typescript
// ✅ CORRECT
'use client'

export function ClientComponent({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    const newData = await fetch('/api/update').then(r => r.json())
    setData(newData)
    setLoading(false)
  }

  return (
    <button onClick={handleUpdate} disabled={loading}>
      {loading ? 'Loading...' : 'Update'}
    </button>
  )
}
```

3. **Proper dynamic loading**
```typescript
// ✅ CORRECT
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading heavy component...</div>,
  ssr: false // Only disable SSR if component requires browser APIs
})
```

## 🚀 Best Practices Summary

1. **Server Components First**: Always start with Server Components
2. **Add 'use client' только when necessary**: Minimal client boundaries
3. **Prefetch Data**: Use server-side data fetching when possible
4. **Composable Architecture**: Server components → Client components → Server components
5. **Type-Safe Params**: Always type your route parameters
6. **SEO-First**: Leverage metadata API for all pages
7. **Error Boundaries**: Use error.tsx and loading.tsx appropriately

Remember: App Router flips the mental model - Server Components are the default, Client Components are the exception.
