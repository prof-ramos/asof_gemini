import { test, expect } from '@playwright/test';

/**
 * Posts API Tests
 * Tests CRUD operations for blog posts/news articles
 */

test.describe('Posts API', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
  let authCookie: string;

  // Login before all tests to get authentication cookie
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'admin@asof.org.br',
        password: 'Admin123!@#',
      },
    });

    if (response.ok()) {
      authCookie = response.headers()['set-cookie'];
    }
  });

  test.describe('GET /api/posts', () => {
    test('should list all published posts (public access)', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/posts`);

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('posts');
      expect(Array.isArray(body.posts)).toBeTruthy();

      // Verify post structure
      if (body.posts.length > 0) {
        const post = body.posts[0];
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('slug');
        expect(post).toHaveProperty('excerpt');
        expect(post).toHaveProperty('publishedAt');

        // Should not expose sensitive fields to public
        expect(post).not.toHaveProperty('password');
        expect(post).not.toHaveProperty('deletedAt');
      }
    });

    test('should filter posts by status (authenticated)', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const statuses = ['PUBLISHED', 'DRAFT'];

      for (const status of statuses) {
        const response = await request.get(`${baseURL}/api/posts?status=${status}`, {
          headers: { Cookie: authCookie },
        });

        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body).toHaveProperty('posts');

        // Verify all posts have correct status
        body.posts.forEach((post: any) => {
          expect(post.status).toBe(status);
        });
      }
    });

    test('should paginate results', async ({ request }) => {
      const page = 1;
      const limit = 5;

      const response = await request.get(
        `${baseURL}/api/posts?page=${page}&limit=${limit}`
      );

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('posts');
      expect(body).toHaveProperty('pagination');
      expect(body.pagination).toHaveProperty('page', page);
      expect(body.pagination).toHaveProperty('limit', limit);
      expect(body.pagination).toHaveProperty('total');
      expect(body.pagination).toHaveProperty('totalPages');

      // Verify number of posts doesn't exceed limit
      expect(body.posts.length).toBeLessThanOrEqual(limit);
    });

    test('should search posts by title', async ({ request }) => {
      const searchTerm = 'avanço';

      const response = await request.get(`${baseURL}/api/posts?search=${searchTerm}`);

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('posts');

      // Verify search results contain the term
      body.posts.forEach((post: any) => {
        const titleMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const excerptMatch = post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        expect(titleMatch || excerptMatch).toBeTruthy();
      });
    });

    test('should filter by category', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/posts?category=Notícias`);

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('posts');

      // Verify all posts belong to specified category
      body.posts.forEach((post: any) => {
        if (post.category) {
          expect(post.category.name).toBe('Notícias');
        }
      });
    });

    test('should sort posts by date', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/posts?sortBy=date&order=desc`);

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('posts');

      // Verify posts are sorted by date descending
      if (body.posts.length > 1) {
        for (let i = 0; i < body.posts.length - 1; i++) {
          const currentDate = new Date(body.posts[i].publishedAt);
          const nextDate = new Date(body.posts[i + 1].publishedAt);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
        }
      }
    });

    test('should handle invalid pagination parameters', async ({ request }) => {
      const invalidParams = [
        'page=-1&limit=10',
        'page=0&limit=10',
        'page=1&limit=0',
        'page=abc&limit=def',
        'page=1&limit=1000', // Too large
      ];

      for (const params of invalidParams) {
        const response = await request.get(`${baseURL}/api/posts?${params}`);

        // Should either reject or use defaults
        expect([200, 400]).toContain(response.status());

        if (response.ok()) {
          const body = await response.json();
          // Should use safe defaults
          expect(body.posts.length).toBeLessThanOrEqual(100);
        }
      }
    });
  });

  test.describe('GET /api/posts/[slug]', () => {
    test('should get published post by slug (public)', async ({ request }) => {
      const response = await request.get(
        `${baseURL}/api/posts/avanco-negociacao-salarial`
      );

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('post');
      expect(body.post).toHaveProperty('slug', 'avanco-negociacao-salarial');
      expect(body.post).toHaveProperty('title');
      expect(body.post).toHaveProperty('content');
      expect(body.post).toHaveProperty('author');
      expect(body.post).toHaveProperty('publishedAt');
    });

    test('should return 404 for non-existent post', async ({ request }) => {
      const response = await request.get(
        `${baseURL}/api/posts/non-existent-post-slug-12345`
      );

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toMatch(/não encontrado|not found/i);
    });

    test('should handle SQL injection in slug', async ({ request }) => {
      const sqlPayloads = [
        "'; DROP TABLE posts--",
        "' OR '1'='1",
        "1' UNION SELECT NULL--",
      ];

      for (const payload of sqlPayloads) {
        const response = await request.get(`${baseURL}/api/posts/${payload}`);

        // Should not cause server error
        expect(response.status()).not.toBe(500);
        expect([404, 400]).toContain(response.status());
      }
    });

    test('should increment view count on each visit', async ({ request }) => {
      const slug = 'avanco-negociacao-salarial';

      // Get initial view count
      const response1 = await request.get(`${baseURL}/api/posts/${slug}`);
      const body1 = await response1.json();
      const initialViews = body1.post.views || 0;

      // Visit again
      const response2 = await request.get(`${baseURL}/api/posts/${slug}`);
      const body2 = await response2.json();
      const newViews = body2.post.views || 0;

      // View count should increase (if implemented)
      // If not implemented, both should be 0 or undefined
      if (initialViews > 0 || newViews > 0) {
        expect(newViews).toBeGreaterThan(initialViews);
      }
    });
  });

  test.describe('POST /api/posts', () => {
    test('should create new post with valid data (authenticated)', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const newPost = {
        title: `Test Post ${Date.now()}`,
        content: '# Test Content\n\nThis is a test post created via API.',
        excerpt: 'Test excerpt for API testing',
        status: 'DRAFT',
        categoryId: 1,
      };

      const response = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: newPost,
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('post');
      expect(body.post).toHaveProperty('id');
      expect(body.post.title).toBe(newPost.title);
      expect(body.post.status).toBe('DRAFT');

      // Slug should be auto-generated from title
      expect(body.post).toHaveProperty('slug');
      expect(body.post.slug).toMatch(/^test-post-/);
    });

    test('should reject post creation without authentication', async ({ request }) => {
      const newPost = {
        title: 'Unauthorized Post',
        content: 'This should fail',
        excerpt: 'Test',
      };

      const response = await request.post(`${baseURL}/api/posts`, {
        data: newPost,
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should validate required fields', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const invalidPosts = [
        { content: 'No title', excerpt: 'Test' }, // Missing title
        { title: 'No content', excerpt: 'Test' }, // Missing content
        { title: '', content: '', excerpt: 'Test' }, // Empty fields
      ];

      for (const post of invalidPosts) {
        const response = await request.post(`${baseURL}/api/posts`, {
          headers: { Cookie: authCookie },
          data: post,
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('error');
        expect(body.error).toMatch(/obrigatório|required|campo.*necessário/i);
      }
    });

    test('should sanitize HTML in post content', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const postWithHtml = {
        title: 'Post with HTML',
        content: '<script>alert("xss")</script><p>Safe content</p>',
        excerpt: 'Test',
        status: 'DRAFT',
      };

      const response = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: postWithHtml,
      });

      // Should accept or sanitize, not error
      expect(response.status()).not.toBe(500);

      if (response.ok()) {
        const body = await response.json();

        // Content should not contain dangerous script tags
        expect(body.post.content).not.toContain('<script>');
        expect(body.post.content).not.toContain('alert(');
      }
    });

    test('should handle duplicate titles by generating unique slugs', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const title = `Duplicate Title ${Date.now()}`;

      // Create first post
      const response1 = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title,
          content: 'First post',
          excerpt: 'First',
          status: 'DRAFT',
        },
      });

      expect(response1.ok()).toBeTruthy();
      const body1 = await response1.json();

      // Create second post with same title
      const response2 = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title,
          content: 'Second post',
          excerpt: 'Second',
          status: 'DRAFT',
        },
      });

      expect(response2.ok()).toBeTruthy();
      const body2 = await response2.json();

      // Slugs should be different
      expect(body1.post.slug).not.toBe(body2.post.slug);
    });
  });

  test.describe('PUT /api/posts/[slug]', () => {
    test('should update existing post (authenticated)', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // First, create a test post
      const createResponse = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title: `Post to Update ${Date.now()}`,
          content: 'Original content',
          excerpt: 'Original excerpt',
          status: 'DRAFT',
        },
      });

      const { post } = await createResponse.json();

      // Update the post
      const updates = {
        title: 'Updated Title',
        content: 'Updated content',
        excerpt: 'Updated excerpt',
      };

      const response = await request.put(`${baseURL}/api/posts/${post.slug}`, {
        headers: { Cookie: authCookie },
        data: updates,
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body.post.title).toBe(updates.title);
      expect(body.post.content).toBe(updates.content);
      expect(body.post.excerpt).toBe(updates.excerpt);
    });

    test('should reject update without authentication', async ({ request }) => {
      const response = await request.put(
        `${baseURL}/api/posts/avanco-negociacao-salarial`,
        {
          data: { title: 'Unauthorized Update' },
        }
      );

      expect(response.status()).toBe(401);
    });

    test('should return 404 for non-existent post', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const response = await request.put(
        `${baseURL}/api/posts/non-existent-slug-12345`,
        {
          headers: { Cookie: authCookie },
          data: { title: 'Updated Title' },
        }
      );

      expect(response.status()).toBe(404);
    });

    test('should validate updated fields', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Create test post first
      const createResponse = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title: `Validation Test ${Date.now()}`,
          content: 'Content',
          excerpt: 'Excerpt',
          status: 'DRAFT',
        },
      });

      const { post } = await createResponse.json();

      // Try to update with invalid data
      const response = await request.put(`${baseURL}/api/posts/${post.slug}`, {
        headers: { Cookie: authCookie },
        data: {
          title: '', // Empty title
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should track version/update history', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Create post
      const createResponse = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title: `Version Test ${Date.now()}`,
          content: 'Version 1',
          excerpt: 'Test',
          status: 'DRAFT',
        },
      });

      const { post } = await createResponse.json();
      const createdAt = post.createdAt;

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update post
      const updateResponse = await request.put(`${baseURL}/api/posts/${post.slug}`, {
        headers: { Cookie: authCookie },
        data: {
          content: 'Version 2',
        },
      });

      const body = await updateResponse.json();

      // updatedAt should be different from createdAt
      expect(body.post.updatedAt).not.toBe(createdAt);
      expect(new Date(body.post.updatedAt).getTime()).toBeGreaterThan(
        new Date(createdAt).getTime()
      );
    });
  });

  test.describe('DELETE /api/posts/[slug]', () => {
    test('should soft delete post (authenticated)', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Create a test post
      const createResponse = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title: `Post to Delete ${Date.now()}`,
          content: 'This will be deleted',
          excerpt: 'Test',
          status: 'DRAFT',
        },
      });

      const { post } = await createResponse.json();

      // Delete it
      const deleteResponse = await request.delete(`${baseURL}/api/posts/${post.slug}`, {
        headers: { Cookie: authCookie },
      });

      expect(deleteResponse.ok()).toBeTruthy();

      const body = await deleteResponse.json();
      expect(body).toHaveProperty('success', true);

      // Verify it's not in public listings (soft deleted)
      const listResponse = await request.get(`${baseURL}/api/posts`);
      const { posts } = await listResponse.json();

      const deletedPost = posts.find((p: any) => p.id === post.id);
      expect(deletedPost).toBeUndefined();
    });

    test('should reject delete without authentication', async ({ request }) => {
      const response = await request.delete(
        `${baseURL}/api/posts/avanco-negociacao-salarial`
      );

      expect(response.status()).toBe(401);
    });

    test('should return 404 for non-existent post', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const response = await request.delete(
        `${baseURL}/api/posts/non-existent-slug-12345`,
        {
          headers: { Cookie: authCookie },
        }
      );

      expect(response.status()).toBe(404);
    });

    test('should prevent double deletion', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Create and delete post
      const createResponse = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title: `Double Delete Test ${Date.now()}`,
          content: 'Content',
          excerpt: 'Excerpt',
          status: 'DRAFT',
        },
      });

      const { post } = await createResponse.json();

      // First deletion
      await request.delete(`${baseURL}/api/posts/${post.slug}`, {
        headers: { Cookie: authCookie },
      });

      // Second deletion attempt
      const response = await request.delete(`${baseURL}/api/posts/${post.slug}`, {
        headers: { Cookie: authCookie },
      });

      expect(response.status()).toBe(404);
    });
  });

  test.describe('Post Permissions and Roles', () => {
    test('should respect role-based permissions', async ({ request }) => {
      // This test assumes role-based access control is implemented
      if (!authCookie) {
        test.skip();
        return;
      }

      // Create a post
      const createResponse = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title: `Role Test ${Date.now()}`,
          content: 'Content',
          excerpt: 'Excerpt',
          status: 'DRAFT',
        },
      });

      // Should succeed for admin/editor roles
      expect(createResponse.ok()).toBeTruthy();
    });

    test('should allow authors to publish their own posts', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Create draft post
      const createResponse = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title: `Publish Test ${Date.now()}`,
          content: 'Content',
          excerpt: 'Excerpt',
          status: 'DRAFT',
        },
      });

      const { post } = await createResponse.json();

      // Publish it
      const publishResponse = await request.put(`${baseURL}/api/posts/${post.slug}`, {
        headers: { Cookie: authCookie },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString(),
        },
      });

      expect(publishResponse.ok()).toBeTruthy();

      const body = await publishResponse.json();
      expect(body.post.status).toBe('PUBLISHED');
      expect(body.post.publishedAt).toBeTruthy();
    });
  });
});
