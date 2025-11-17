import { ReactNode } from 'react';

// Component Props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'highlight' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  asChild?: boolean;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export interface NewsCardProps {
  date: string;
  category: string;
  title: string;
  image: string;
  slug: string;
  excerpt?: string;
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

// Content & Data Types

// ============================================================================
// MDX-based News Types (Legacy/Static)
// ============================================================================
export interface NewsMetadata {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  author: string;
  image: string;
  slug: string;
  readingTime?: string;
}

export interface NewsPost extends NewsMetadata {
  content: string;
}

// ============================================================================
// Database-based Post Types (CMS)
// ============================================================================

export interface PostAuthor {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

export interface PostTag {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

export interface PostMedia {
  id: string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

export type PostStatus = 'DRAFT' | 'IN_REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  status: PostStatus;

  // SEO & Metadata
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImage?: string | null;

  // Publishing
  authorId: string;
  author?: PostAuthor;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  featuredImageId?: string | null;
  featuredImage?: PostMedia | null;
  isFeatured: boolean;
  viewCount: number;
  readingTime?: number | null; // in minutes

  // Content organization
  categoryId?: string | null;
  category?: PostCategory | null;
  tags?: PostTag[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// ============================================================================
// Post Input Types (for Forms & API)
// ============================================================================

export interface CreatePostInput {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  status?: PostStatus;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;

  // Publishing
  publishedAt?: Date | string;
  scheduledAt?: Date | string;
  featuredImageId?: string;
  isFeatured?: boolean;

  // Organization
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: Date | null;
  readingTime?: number | null;
  viewCount: number;
  isFeatured: boolean;
  author: PostAuthor;
  category?: PostCategory | null;
  featuredImage?: PostMedia | null;
  tags?: PostTag[];
}

export interface PostsListResponse {
  success: boolean;
  data: PostListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PostDetailResponse {
  success: boolean;
  data: Post;
}

export interface PostErrorResponse {
  success: false;
  error: string;
}

// ============================================================================
// Hybrid System Types
// ============================================================================

export type PostSource = 'mdx' | 'database';

export interface HybridPost {
  source: PostSource;
  post: NewsPost | Post;
}

// Site Configuration Types
export interface SiteConfig {
  name: string;
  fullName: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
}
