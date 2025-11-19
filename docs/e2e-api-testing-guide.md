# API Testing Implementation Guide

**Priority**: ⭐⭐⭐ High
**Estimated Time**: 4-6 hours
**Framework**: Playwright API Testing

---

## Overview

This guide shows how to implement comprehensive API testing for the ASOF project's REST API endpoints using Playwright's built-in API testing capabilities.

---

## 1. Setup

### Install Dependencies

```bash
# Playwright already installed, no additional dependencies needed
```

### Create API Test Directory

```bash
mkdir -p e2e/tests/api
```

---

## 2. Authentication API Tests

Create `e2e/tests/api/auth.api.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import bcrypt from 'bcryptjs';

test.describe('Authentication API', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';

  test.describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('user');
      expect(body.user).toHaveProperty('email', 'admin@asof.org.br');
      expect(body.user).toHaveProperty('role');

      // Verify session cookie set
      const cookies = response.headers()['set-cookie'];
      expect(cookies).toBeTruthy();
      expect(cookies).toContain('admin-auth-token');
    });

    test('should reject invalid credentials', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'WrongPassword',
        },
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toMatch(/credenciais inválidas|invalid credentials/i);
    });

    test('should reject non-existent user', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'nonexistent@example.com',
          password: 'Password123',
        },
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should validate required fields', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          // Missing password
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should validate email format', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'invalid-email',
          password: 'Password123',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toMatch(/e-mail inválido|invalid email/i);
    });

    test('should implement rate limiting', async ({ request }) => {
      // Attempt multiple failed logins
      const attempts = [];
      for (let i = 0; i < 6; i++) {
        attempts.push(
          request.post(`${baseURL}/api/auth/login`, {
            data: {
              email: 'test@example.com',
              password: 'WrongPassword',
            },
          })
        );
      }

      const responses = await Promise.all(attempts);
      const lastResponse = responses[responses.length - 1];

      // After 5 failed attempts, should be rate limited
      expect(lastResponse.status()).toBe(429); // Too Many Requests
    });

    test('should track failed login attempts', async ({ request }) => {
      const email = `test-${Date.now()}@example.com`;

      // First failed attempt
      await request.post(`${baseURL}/api/auth/login`, {
        data: { email, password: 'Wrong1' },
      });

      // Second failed attempt
      await request.post(`${baseURL}/api/auth/login`, {
        data: { email, password: 'Wrong2' },
      });

      // Third failed attempt - should include attempt count in response
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: { email, password: 'Wrong3' },
      });

      const body = await response.json();
      expect(body).toHaveProperty('attemptsRemaining');
      expect(body.attemptsRemaining).toBeLessThanOrEqual(2);
    });
  });

  test.describe('POST /api/auth/logout', () => {
    test('should logout authenticated user', async ({ request }) => {
      // First, login to get session cookie
      const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      const cookies = loginResponse.headers()['set-cookie'];

      // Then logout
      const logoutResponse = await request.post(`${baseURL}/api/auth/logout`, {
        headers: {
          Cookie: cookies,
        },
      });

      expect(logoutResponse.ok()).toBeTruthy();

      const body = await logoutResponse.json();
      expect(body).toHaveProperty('success', true);

      // Verify cookie is cleared
      const logoutCookies = logoutResponse.headers()['set-cookie'];
      expect(logoutCookies).toContain('admin-auth-token=;');
    });

    test('should handle logout without session', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/logout`);

      // Should still succeed (idempotent)
      expect(response.ok()).toBeTruthy();
    });
  });
});
```

---

## 3. Posts API Tests

Create `e2e/tests/api/posts.api.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Posts API', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
  let authCookie: string;

  // Login before all tests
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'admin@asof.org.br',
        password: 'Admin123!@#',
      },
    });

    authCookie = response.headers()['set-cookie'];
  });

  test.describe('GET /api/posts', () => {
    test('should list all posts', async ({ request }) => {
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
        expect(post).toHaveProperty('status');
        expect(post).toHaveProperty('publishedAt');
      }
    });

    test('should filter posts by status', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/posts?status=PUBLISHED`);

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      body.posts.forEach((post: any) => {
        expect(post.status).toBe('PUBLISHED');
      });
    });

    test('should paginate results', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/posts?page=1&limit=5`);

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('posts');
      expect(body).toHaveProperty('pagination');
      expect(body.pagination).toHaveProperty('page', 1);
      expect(body.pagination).toHaveProperty('limit', 5);
      expect(body.pagination).toHaveProperty('total');
      expect(body.posts.length).toBeLessThanOrEqual(5);
    });

    test('should search posts by title', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/posts?search=Avanço`);

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      body.posts.forEach((post: any) => {
        expect(post.title.toLowerCase()).toContain('avanço'.toLowerCase());
      });
    });
  });

  test.describe('GET /api/posts/[slug]', () => {
    test('should get post by slug', async ({ request }) => {
      const response = await request.get(
        `${baseURL}/api/posts/avanco-negociacao-salarial`
      );

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('post');
      expect(body.post).toHaveProperty('slug', 'avanco-negociacao-salarial');
      expect(body.post).toHaveProperty('title');
      expect(body.post).toHaveProperty('content');
    });

    test('should return 404 for non-existent post', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/posts/non-existent-slug`);

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });
  });

  test.describe('POST /api/posts', () => {
    test('should create new post (authenticated)', async ({ request }) => {
      const newPost = {
        title: `Test Post ${Date.now()}`,
        content: 'Test content for API testing',
        excerpt: 'Test excerpt',
        status: 'DRAFT',
        categoryId: 1,
      };

      const response = await request.post(`${baseURL}/api/posts`, {
        headers: {
          Cookie: authCookie,
        },
        data: newPost,
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('post');
      expect(body.post).toHaveProperty('id');
      expect(body.post.title).toBe(newPost.title);
    });

    test('should reject unauthenticated post creation', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/posts`, {
        data: {
          title: 'Unauthorized Post',
          content: 'This should fail',
        },
      });

      expect(response.status()).toBe(401);
    });

    test('should validate required fields', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/posts`, {
        headers: {
          Cookie: authCookie,
        },
        data: {
          // Missing title and content
          excerpt: 'Only excerpt',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toMatch(/required|obrigatório/i);
    });
  });

  test.describe('PUT /api/posts/[slug]', () => {
    test('should update existing post', async ({ request }) => {
      const updates = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const response = await request.put(
        `${baseURL}/api/posts/avanco-negociacao-salarial`,
        {
          headers: {
            Cookie: authCookie,
          },
          data: updates,
        }
      );

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body.post.title).toBe(updates.title);
    });

    test('should reject unauthorized update', async ({ request }) => {
      const response = await request.put(
        `${baseURL}/api/posts/avanco-negociacao-salarial`,
        {
          data: { title: 'Unauthorized Update' },
        }
      );

      expect(response.status()).toBe(401);
    });
  });

  test.describe('DELETE /api/posts/[slug]', () => {
    test('should soft delete post', async ({ request }) => {
      // Create a test post first
      const createResponse = await request.post(`${baseURL}/api/posts`, {
        headers: { Cookie: authCookie },
        data: {
          title: `Post to Delete ${Date.now()}`,
          content: 'This will be deleted',
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

      // Verify it's not in public listings
      const listResponse = await request.get(`${baseURL}/api/posts`);
      const { posts } = await listResponse.json();

      const deletedPost = posts.find((p: any) => p.id === post.id);
      expect(deletedPost).toBeUndefined();
    });
  });
});
```

---

## 4. Media API Tests

Create `e2e/tests/api/media.api.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Media API', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
  let authCookie: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'admin@asof.org.br',
        password: 'Admin123!@#',
      },
    });

    authCookie = response.headers()['set-cookie'];
  });

  test.describe('POST /api/media/upload', () => {
    test('should upload image file', async ({ request }) => {
      // Create a test image buffer (1x1 PNG)
      const testImage = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: {
          Cookie: authCookie,
        },
        multipart: {
          file: {
            name: `test-image-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: testImage,
          },
          alt: 'Test image for API testing',
          title: 'Test Image',
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('media');
      expect(body.media).toHaveProperty('id');
      expect(body.media).toHaveProperty('url');
      expect(body.media).toHaveProperty('mimeType', 'image/png');
    });

    test('should reject upload without authentication', async ({ request }) => {
      const testImage = Buffer.from('fake-image-data');

      const response = await request.post(`${baseURL}/api/media/upload`, {
        multipart: {
          file: {
            name: 'test.png',
            mimeType: 'image/png',
            buffer: testImage,
          },
        },
      });

      expect(response.status()).toBe(401);
    });

    test('should reject invalid file types', async ({ request }) => {
      const testFile = Buffer.from('fake executable');

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: {
          Cookie: authCookie,
        },
        multipart: {
          file: {
            name: 'malicious.exe',
            mimeType: 'application/x-msdownload',
            buffer: testFile,
          },
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toMatch(/tipo de arquivo não permitido|invalid file type/i);
    });

    test('should reject files exceeding size limit', async ({ request }) => {
      // Create large buffer (e.g., 11MB if limit is 10MB)
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024);

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: {
          Cookie: authCookie,
        },
        multipart: {
          file: {
            name: 'large-file.jpg',
            mimeType: 'image/jpeg',
            buffer: largeBuffer,
          },
        },
      });

      expect(response.status()).toBe(413); // Payload Too Large

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toMatch(/arquivo muito grande|file too large/i);
    });
  });

  test.describe('GET /api/media', () => {
    test('should list all media', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/media`, {
        headers: {
          Cookie: authCookie,
        },
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('media');
      expect(Array.isArray(body.media)).toBeTruthy();

      if (body.media.length > 0) {
        const item = body.media[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('url');
        expect(item).toHaveProperty('mimeType');
        expect(item).toHaveProperty('size');
      }
    });

    test('should filter media by type', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/media?type=image`, {
        headers: {
          Cookie: authCookie,
        },
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      body.media.forEach((item: any) => {
        expect(item.mimeType).toMatch(/^image\//);
      });
    });
  });

  test.describe('GET /api/media/[id]', () => {
    test('should get media by ID', async ({ request }) => {
      // First, get list of media
      const listResponse = await request.get(`${baseURL}/api/media`, {
        headers: { Cookie: authCookie },
      });

      const { media } = await listResponse.json();

      if (media.length > 0) {
        const mediaId = media[0].id;

        const response = await request.get(`${baseURL}/api/media/${mediaId}`, {
          headers: { Cookie: authCookie },
        });

        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body).toHaveProperty('media');
        expect(body.media.id).toBe(mediaId);
      }
    });

    test('should return 404 for non-existent media', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/media/99999`, {
        headers: { Cookie: authCookie },
      });

      expect(response.status()).toBe(404);
    });
  });

  test.describe('DELETE /api/media/[id]', () => {
    test('should delete media', async ({ request }) => {
      // Upload a test file first
      const testImage = Buffer.from('test-data');
      const uploadResponse = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: 'to-delete.png',
            mimeType: 'image/png',
            buffer: testImage,
          },
        },
      });

      const { media } = await uploadResponse.json();

      // Delete it
      const deleteResponse = await request.delete(
        `${baseURL}/api/media/${media.id}`,
        {
          headers: { Cookie: authCookie },
        }
      );

      expect(deleteResponse.ok()).toBeTruthy();

      // Verify it's gone
      const getResponse = await request.get(`${baseURL}/api/media/${media.id}`, {
        headers: { Cookie: authCookie },
      });

      expect(getResponse.status()).toBe(404);
    });
  });
});
```

---

## 5. API Test Fixtures

Create `e2e/fixtures/api-data.ts`:

```typescript
/**
 * API Test Data
 */

export const validPost = {
  title: 'Test Post Title',
  content: '# Test Content\n\nThis is a test post for API testing.',
  excerpt: 'Test excerpt for API testing',
  status: 'DRAFT' as const,
  categoryId: 1,
};

export const invalidPost = {
  title: '', // Empty title (invalid)
  content: '', // Empty content (invalid)
};

export const adminCredentials = {
  valid: {
    email: 'admin@asof.org.br',
    password: 'Admin123!@#',
  },
  invalid: {
    email: 'admin@asof.org.br',
    password: 'WrongPassword',
  },
  nonExistent: {
    email: 'nonexistent@example.com',
    password: 'Password123',
  },
};

export const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPass123!',
  role: 'EDITOR',
};

export const mediaTypes = {
  allowed: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ],
  disallowed: [
    'application/x-msdownload', // .exe
    'application/x-sh', // Shell scripts
    'text/x-php', // PHP files
  ],
};

export const apiHeaders = {
  json: {
    'Content-Type': 'application/json',
  },
  multipart: {
    'Content-Type': 'multipart/form-data',
  },
};

export const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
};
```

---

## 6. API Helper Functions

Create `e2e/utils/api-helpers.ts`:

```typescript
import { APIRequestContext } from '@playwright/test';

/**
 * API Helper Functions
 */

export async function loginAndGetCookie(
  request: APIRequestContext,
  baseURL: string,
  email: string,
  password: string
): Promise<string> {
  const response = await request.post(`${baseURL}/api/auth/login`, {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()}`);
  }

  return response.headers()['set-cookie'];
}

export async function createTestPost(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  postData: any
): Promise<any> {
  const response = await request.post(`${baseURL}/api/posts`, {
    headers: { Cookie: authCookie },
    data: postData,
  });

  if (!response.ok()) {
    throw new Error(`Post creation failed: ${response.status()}`);
  }

  const body = await response.json();
  return body.post;
}

export async function uploadTestMedia(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Promise<any> {
  const response = await request.post(`${baseURL}/api/media/upload`, {
    headers: { Cookie: authCookie },
    multipart: {
      file: { name: fileName, mimeType, buffer },
    },
  });

  if (!response.ok()) {
    throw new Error(`Media upload failed: ${response.status()}`);
  }

  const body = await response.json();
  return body.media;
}

export function createTestImage(width: number = 1, height: number = 1): Buffer {
  // Simple 1x1 transparent PNG
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
}

export async function cleanupTestData(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  resourceType: 'post' | 'media',
  ids: string[]
): Promise<void> {
  const endpoint = resourceType === 'post' ? '/api/posts' : '/api/media';

  for (const id of ids) {
    await request.delete(`${baseURL}${endpoint}/${id}`, {
      headers: { Cookie: authCookie },
    });
  }
}
```

---

## 7. npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:api": "playwright test e2e/tests/api/",
    "test:api:auth": "playwright test e2e/tests/api/auth.api.spec.ts",
    "test:api:posts": "playwright test e2e/tests/api/posts.api.spec.ts",
    "test:api:media": "playwright test e2e/tests/api/media.api.spec.ts"
  }
}
```

---

## 8. CI/CD Integration

Add to `.github/workflows/e2e-tests.yml`:

```yaml
api-tests:
  name: API Tests
  timeout-minutes: 15
  runs-on: ubuntu-latest

  steps:
    - name: Checkout código
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Instalar dependências
      run: npm ci

    - name: Build do projeto
      run: npm run build

    - name: Executar testes de API
      run: npm run test:api
      env:
        CI: true
        DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

    - name: Upload de relatórios API
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: api-test-results
        path: test-results/
        retention-days: 30
```

---

## 9. Best Practices

### Authentication
- ✅ Use `test.beforeAll()` to login once per test file
- ✅ Store auth cookie and reuse in tests
- ✅ Avoid logging in for every test (performance)

### Test Data
- ✅ Create test data in `beforeEach()` or `beforeAll()`
- ✅ Clean up in `afterEach()` or `afterAll()`
- ✅ Use unique identifiers (timestamps) for test data

### Assertions
- ✅ Verify HTTP status codes
- ✅ Validate response body structure
- ✅ Check headers (especially cookies)
- ✅ Verify database state if needed

### Error Handling
- ✅ Test both success and failure scenarios
- ✅ Verify error messages are descriptive
- ✅ Check appropriate status codes for errors

---

## 10. Running Tests

```bash
# All API tests
npm run test:api

# Specific test file
npm run test:api:auth

# With UI
npx playwright test e2e/tests/api/ --ui

# Debug mode
npx playwright test e2e/tests/api/ --debug

# Generate report
npx playwright test e2e/tests/api/ && npm run test:report
```

---

## 11. Expected Coverage

After implementation, you will have:

- ✅ Authentication flow testing
- ✅ CRUD operations for posts
- ✅ Media upload/download/delete
- ✅ Authorization verification
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ Session management

**Estimated Test Count**: 30-40 API tests

---

## Conclusion

This implementation provides comprehensive API testing coverage using Playwright's built-in API testing capabilities. The tests are fast, reliable, and integrate seamlessly with your existing E2E test suite.

**Next Steps**:
1. Implement authentication tests first
2. Add posts API tests
3. Implement media API tests
4. Add to CI/CD pipeline
5. Monitor test execution times

**Estimated Implementation Time**: 4-6 hours
