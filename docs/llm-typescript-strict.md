# TypeScript Strict Mode - LLM Guide

## 🎯 IMMEDIATE CRITICAL RULES

### 1. NO IMPLICIT ANY TYPES
```typescript
// ✅ ALWAYS DO THIS
interface User {
  id: number
  name: string
  email: string
}

function processUser(user: User) {
  return `${user.name} <${user.email}>`
}

// ❌ NEVER DO THIS
function processUser(user) { // ERROR: implicit 'any' type
  return user.name // ERROR: property access on 'any'
}
```

### 2. NO UNUSED VARIABLES/PARAMETERS
```typescript
// ✅ ALWAYS DO THIS
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price, 0)
}

// ❌ NEVER DO THIS
function calculateTotal(items, tax) { // ERROR: unused 'tax' parameter
  return items.reduce((total, item) => { // Unused 'item' variable
    return total + item.price
  }, 0)
}
```

### 3. STRICT NULL CHECKS
```typescript
// ✅ ALWAYS DO THIS
function getUserName(user: User | null): string {
  return user?.name ?? 'Anonymous'
}

// ❌ NEVER DO THIS
function getUserName(user: User | null) {
  return user.name // ERROR: 'user' is possibly 'null'
}
```

## 📝 TypeScript Configuration (MANDATORY)

### tsconfig.json - Strict Settings
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,                           // 🚨 CRITICAL: Must be true
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,

    "plugins": [{ "name": "next" }],

    "paths": {
      "@/*": ["./*"]                          // 🚨 CRITICAL: Must use path aliases
    },

    "noUnusedLocals": true,                   // 🚨 CRITICAL: No unused locals
    "noUnusedParameters": true,              // 🚨 CRITICAL: No unused params
    "noFallthroughCasesInSwitch": true,      // 🚨 CRITICAL: Switch case safety
    "exactOptionalPropertyTypes": true       // 🚨 CRITICAL: Exact optional props
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🔧 Essential Type Patterns

### 1. Component Props (Strict Typing)
```typescript
// ✅ CORRECT - Strict interface props
interface ButtonProps {
  children: React.ReactNode
  variant: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

// ❌ WRONG - Loose typing
interface ButtonProps {
  children: any                // ERROR: no 'any' types
  variant?: string            // ERROR: too broad
  size: string               // ERROR: not specific enough
  onClick: Function          // ERROR: too broad, no parameter typing
}
```

### 2. API Response Types (Server Components)
```typescript
// ✅ CORRECT - Server Component with typed API
interface Post {
  id: string
  title: string
  content: string
  publishedAt: Date
  author: {
    name: string
    avatar: string
  }
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts')
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts() // Fully typed

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}
```

### 3. Custom Hooks (Client Components)
```typescript
// ✅ CORRECT - Strongly typed custom hook
'use client'

import { useState, useCallback } from 'react'

interface UseCounterReturn {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: (count: number) => void
}

export function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState<number>(initialValue)

  const increment = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])

  const decrement = useCallback(() => {
    setCount(prev => prev - 1)
  }, [])

  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])

  return {
    count,
    increment,
    decrement,
    reset,
    setCount
  }
}

// Usage
export function CounterComponent() {
  const { count, increment, decrement } = useCounter()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

### 4. Context Providers
```typescript
// ✅ CORRECT - Properly typed React Context
'use client'

import { createContext, useContext, ReactNode } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

interface ThemeProviderProps {
  children: ReactNode
  initialTheme?: 'light' | 'dark'
}

export function ThemeProvider({ children, initialTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme)

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to consume context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

## 🚨 ERROR PREVENTION RULES

### ❌ NEVER DO THESE:

1. **Using `any` type anywhere**
```typescript
// ❌ WRONG
const user: any = getUser()           // ERROR: implicit any
const data: User | any = fetchData() // ERROR: any in union
```

2. **Optional properties without default values**
```typescript
interface Config {
  apiUrl: string        // Required
  timeout?: number      // Optional, but must handle undefined
}

function apiCall(config: Config) {
  const timeout = config.timeout ?? 5000 // ✅ Handle undefined
  // NOT: config.timeout || 5000 (fails if timeout is 0)
}
```

3. **Unsafe property access**
```typescript
interface User {
  profile?: {
    name: string
  }
}

const user: User = {}

// ❌ WRONG
const name = user.profile.name // ERROR: profile is possibly undefined

// ✅ CORRECT
const name = user.profile?.name ?? 'Anonymous'
```

4. **Incorrect function overloads**
```typescript
// ❌ WRONG - Order matters in overloads
function createUser(id: number): User
function createUser(name: string): User
function createUser(idOrName: number | string): User {
  // Implementation can't distinguish types properly
}

// ✅ CORRECT - Use union return type instead
function createUser(config: { id: number } | { name: string }): User {
  // Type-safe implementation
}
```

5. **Missing return type annotations**
```typescript
// ❌ WRONG
function fetchUser(id: string) { // ERROR: implicit return type 'any'
  return api.get(`/users/${id}`)
}

// ✅ CORRECT
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`)
  return response.data
}
```

6. **Type assertions without type guards**
```typescript
interface APIResponse {
  success: boolean
  data?: unknown
  error?: string
}

// ❌ WRONG
function handleResponse(response: APIResponse) {
  if (response.success) {
    return response.data as User // ERROR: unsafe type assertion
  }
}

// ✅ CORRECT
function handleResponse(response: APIResponse) {
  if (response.success && response.data) {
    // Type guard before assertion
    if (isUser(response.data)) { // Assume isUser is a type guard
      return response.data
    }
  }
}
```

## 🛠️ Advanced TypeScript Patterns

### Utility Types
```typescript
// ASOF project patterns
interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  publishedAt: Date
  category: string
  author: User
  tags: string[]
}

// Pick - Selecionar apenas propriedades específicas
type NewsCardData = Pick<NewsArticle, 'id' | 'title' | 'excerpt' | 'publishedAt'>

// Omit - Remover propriedades específicas
type NewsFormData = Omit<NewsArticle, 'id' | 'publishedAt' | 'author'>

// Partial - Todas propriedades opcionais (para forms)
type NewsUpdateData = Partial<NewsArticle>

// Required - Todas propriedades obrigatórias
type CompleteNewsArticle = Required<NewsArticle>

// Extract from union types
type SuccessResponse = Extract<APIResponse, { success: true }>
```

### Generic Constraints
```typescript
// API Response wrapper
interface APIResponse<T = unknown> {
  data: T
  success: boolean
  message: string
}

// Database entity base
interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Database operations (constrained generics)
class DatabaseService {
  async findById<T extends BaseEntity>(id: string): Promise<T | null> {
    // Generic constrained to entities with id, createdAt, updatedAt
    return null
  }

  async create<T extends BaseEntity>(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    // Generic with computed properties excluded
    return data as T
  }
}
```

### Discriminated Unions (Type Guards)
```typescript
// News status discriminated union
type NewsStatus =
  | { status: 'draft'; authorId: string }
  | { status: 'published'; publishedAt: Date; slug: string }
  | { status: 'archived'; archivedAt: Date; reason: string }

// Type-safe status handling
function handleNewsStatus(news: NewsStatus) {
  switch (news.status) {
    case 'draft':
      console.log(`Draft by ${news.authorId}`)
      break
    case 'published':
      console.log(`Published on ${news.publishedAt.toDateString()} with slug ${news.slug}`)
      break
    case 'archived':
      console.log(`Archived on ${news.archivedAt.toDateString()} because ${news.reason}`)
      break
    default:
      // TypeScript ensures all cases covered
      const _exhaustiveCheck: never = news
      return _exhaustiveCheck
  }
}
```

## 🧪 Testing with TypeScript

### Component Testing with Playwright
```typescript
// e2e/tests/components/news-card.spec.ts
import { test, expect } from '@playwright/test'
import type { NewsArticle } from '@/types/news'

test.describe('NewsCard Component', () => {
  test('displays article data correctly', async ({ page }) => {
    const testArticle: NewsArticle = {
      id: '1',
      title: 'Test Article',
      excerpt: 'Test excerpt',
      content: 'Full content',
      publishedAt: new Date(),
      category: 'News',
      author: { id: '1', name: 'John Doe', email: 'john@example.com' },
      tags: ['test', 'article']
    }

    await page.goto('/news')
    // Test implementation with typed data
  })
})
```

## 📚 Best Practices Summary

### 1. Type Everything Explicitly
- No implicit `any` types
- No loose type annotations (`string` instead of union)
- Define interfaces for all object shapes

### 2. Use Utility Types
- `Pick`, `Omit`, `Partial` for data transformations
- `Record<K, T>` for dictionary types
- `NonNullable<T>` for null safety

### 3. Handle null/undefined Properly
- Use optional chaining (`?.`)
- Use nullish coalescing (`??`)
- Type guards for runtime checks

### 4. Generic Constraints
- Constrain generics to specific shapes
- Use base interfaces for shared properties
- Computed types for domain-specific needs

### 5. Error Prevention
- Strict mode ON (no exceptions)
- No unused variables/parameters
- Exhaustive switch cases
- Exact optional property types

### 6. Testing Types
- Test utilities with specific types
- E2E tests with interface compliance
- API contracts through TypeScript

Remember: TypeScript strict mode exists to prevent runtime errors through compile-time validation. Embrace the strictness - it's your safety net!
