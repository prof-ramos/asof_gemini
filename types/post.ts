import { Post, ContentStatus } from '@prisma/client'

export { ContentStatus }

export enum ContentType {
  MDX = 'MDX',
  DATABASE = 'DATABASE',
}

// Database post type - aligned with Prisma schema
export type DatabasePost = Omit<Post, 'createdAt' | 'updatedAt'> & {
  createdAt: Date
  updatedAt: Date
}

// MDX post type (existing)
export interface MDXPost {
  slug: string
  title: string
  description: string
  date: string
  image: string
  imageAlt: string
  category: string
  authors: string[]
  content: string
  readingTime: {
    text: string
    minutes: number
  }
  excerpt: string
  categorySlug: string
}

// Hybrid post type - union of MDX and database posts for unified handling
export type HybridPost = MDXPost | DatabasePost

// Post form data for creating/editing posts
export interface PostFormData {
  title: string
  slug?: string
  description: string
  content: string
  excerpt?: string
  image?: string
  imageAlt?: string
  categoryId?: string
  category?: string
  authors?: string[]
  tags?: string[]
  status: ContentStatus
  publishedAt?: Date | null
  isFeatured?: boolean
  contentType: ContentType
}

// Admin list filters
export interface AdminListFilters {
  status?: ContentStatus
  contentType?: ContentType
  categoryId?: string
  search?: string
  published?: boolean
  dateFrom?: Date
  dateTo?: Date
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: Record<string, any>
  }
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Post creation request
export interface CreatePostRequest extends Omit<PostFormData, 'slug'> {
  authorId?: string
}

// Post update request
export interface UpdatePostRequest extends Partial<PostFormData> {
  id: string
}

// Post deletion request (for soft delete)
export interface DeletePostRequest {
  id: string
  hardDelete?: boolean // for permanent deletion
}

// Post statistics
export interface PostStats {
  total: number
  published: number
  draft: number
  archived: number
  byContentType: {
    [ContentType.MDX]: number
    [ContentType.DATABASE]: number
  }
  recentActivity: {
    created: number // last 24h
    updated: number // last 24h
    published: number // last 7 days
  }
}

// Category information (used in posts)
export interface PostCategory {
  id: string
  name: string
  slug: string
  description?: string
}

// Author information (simplified user type)
export interface PostAuthor {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR'
}

// Extended post for admin views
export interface AdminPost extends DatabasePost {
  author: PostAuthor
  category: PostCategory | null
  tags: { id: string; name: string }[]
  editUrl?: string
}

// Form validation errors
export interface ValidationErrors {
  [key: string]: string[] | string
}

// Post preview for listings
export interface PostPreview {
  id: string
  slug: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  status: ContentStatus
  contentType: ContentType
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  category?: {
    id: string
    name: string
    slug: string
  }
  author?: {
    id: string
    name: string
  }
  isFeatured: boolean
}

// Rich text editor content
export interface EditorContent {
  html: string
  json?: any // JSON representation for TipTap editor
}

// Media upload response
export interface MediaUploadResponse {
  url: string
  id: string
  filename: string
  size: number
  type: string
  alt?: string
}

// Hybrid loading options
export interface HybridPostOptions {
  includeMDX?: boolean
  includeDatabase?: boolean
  limit?: number
  offset?: number
  category?: string
  featured?: boolean
  publishedOnly?: boolean
}
