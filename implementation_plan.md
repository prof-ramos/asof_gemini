# Complete News Management CMS Implementation Plan

## Overview
Implement a complete news management system for the ASOF CMS, integrating MDX-based content with a robust database-driven backend. The system will provide full CRUD operations for news articles, hybrid content serving, and a comprehensive admin interface while maintaining the existing MDX workflow for static content.

## Types
Complete TypeScript definitions for the hybrid news management system, extending existing MDX types with Prisma database support.

Key interfaces to add:
- `DatabasePost` - Prisma Post model mapped to application types
- `HybridPost` - Union type for MDX and Database posts
- `PostFormData` - Form validation types for creating/editing posts
- `ApiResponse<T>` - Standardized API response format
- `AdminListFilters` - Filter types for admin listings

## Files
Project structure for complete news management implementation.

### New Files
1. **Types** - `types/post.ts` - Database and hybrid type definitions
2. **API Routes**:
   - `app/api/posts/[id]/route.ts` - Individual post CRUD
   - `app/api/posts/slug/[slug]/route.ts` - Slug-based post retrieval
   - `app/api/posts/admin/route.ts` - Admin-specific post operations
3. **Admin Interface**:
   - `app/admin/posts/page.tsx` - Posts listing dashboard
   - `app/admin/posts/new/page.tsx` - Create post form
   - `app/admin/posts/[id]/edit/page.tsx` - Edit post form
4. **Components**:
   - `components/admin/posts/PostList.tsx` - Admin posts grid/table
   - `components/admin/posts/PostForm.tsx` - Reusable post form
   - `components/admin/posts/PostEditor.tsx` - Rich text editor
   - `components/admin/posts/PostFilters.tsx` - Filter and search interface
5. **Utilities**: `lib/posts.ts` - Hybrid MDX/Database post management

### Modified Files
- `types/index.ts` - Extend with database types
- `app/noticias/page.tsx` - Switch to hybrid post loading
- `package.json` - Add required dependencies if needed
- `prisma/schema.prisma` - Verify Post model completeness

### Deleted Files
None planned.

## Functions
API functions for complete post management with authentication.

### New Functions
- `getServerSession()` wrapper for consistent auth checks
- `getHybridPosts()` - Load posts from both MDX and database sources
- `createPost()` - Database post creation with validation
- `updatePost()` - Post updates with audit trail
- `deletePost()` - Soft delete functionality
- `validatePostData()` - Form data validation

### Modified Functions
- `getAllNews()` in `lib/mdx.ts` - Extend to support hybrid loading
- `prisma.post.create()` - Add full post lifecycle support

### Removed Functions
None planned.

## Classes
Admin interface components for complete post management.

### New Classes
- `PostManagement` - Main posts management component
- `PostEditor` - Rich text editor with image upload
- `PostsDataGrid` - Sortable, filterable posts list
- `PostFormValidator` - Client/server form validation

### Modified Classes
- NewsCard components may need post type detection

### Removed Classes
None planned.

## Dependencies
Required packages for full CMS functionality.

New packages:
- `@tiptap/react` (rich text editor)
- `@tiptap/starter-kit` (editor essentials)
- `zod` (schema validation)
- `react-hook-form` (advanced forms)

Existing packages sufficient for remaining functionality.

## Testing
Comprehensive testing strategy for news management.

### E2E Tests
- Post CRUD operations via admin interface
- Hybrid content serving (MDX vs Database)
- Authentication integration testing
- Media upload and association

### Unit Tests
- API functions with mocked database
- Form validation logic
- Type conversions and data mapping

### Integration Tests
- Full post creation workflow
- Search and filtering functionality
- Performance with large post volumes

## Implementation Order
Logical sequence to minimize conflicts and ensure system stability.

1. Types and data models definition
2. API routes implementation with authentication
3. Admin interface skeleton
4. Post listing and filtering
5. Rich text editor integration
6. Image upload and association
7. Form validation and error handling
8. Hybrid content serving
9. Search and advanced filtering
10. Testing and optimization
11. Migration strategy from MDX
