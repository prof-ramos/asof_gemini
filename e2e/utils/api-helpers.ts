import { APIRequestContext } from '@playwright/test';
import { adminCredentials, testImages } from '../fixtures/api-data';

/**
 * API Helper Functions
 * Reusable functions for common API testing operations
 */

/**
 * Login and get authentication cookie
 */
export async function loginAndGetCookie(
  request: APIRequestContext,
  baseURL: string,
  email: string = adminCredentials.valid.email,
  password: string = adminCredentials.valid.password
): Promise<string> {
  const response = await request.post(`${baseURL}/api/auth/login`, {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()} - ${await response.text()}`);
  }

  const cookies = response.headers()['set-cookie'];
  if (!cookies) {
    throw new Error('No cookies received from login');
  }

  return cookies;
}

/**
 * Create a test post
 */
export async function createTestPost(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  postData: {
    title: string;
    content: string;
    excerpt?: string;
    status?: 'DRAFT' | 'PUBLISHED';
    categoryId?: number;
  }
): Promise<any> {
  const response = await request.post(`${baseURL}/api/posts`, {
    headers: { Cookie: authCookie },
    data: {
      excerpt: 'Test excerpt',
      status: 'DRAFT',
      ...postData,
    },
  });

  if (!response.ok()) {
    throw new Error(`Post creation failed: ${response.status()} - ${await response.text()}`);
  }

  const body = await response.json();
  return body.post;
}

/**
 * Upload test media file
 */
export async function uploadTestMedia(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  options: {
    fileName?: string;
    mimeType?: string;
    buffer?: Buffer;
    alt?: string;
    title?: string;
  } = {}
): Promise<any> {
  const {
    fileName = `test-${Date.now()}.png`,
    mimeType = 'image/png',
    buffer = testImages.transparentPNG,
    alt = 'Test image',
    title = 'Test Image',
  } = options;

  const response = await request.post(`${baseURL}/api/media/upload`, {
    headers: { Cookie: authCookie },
    multipart: {
      file: { name: fileName, mimeType, buffer },
      alt,
      title,
    },
  });

  if (!response.ok()) {
    throw new Error(`Media upload failed: ${response.status()} - ${await response.text()}`);
  }

  const body = await response.json();
  return body.media;
}

/**
 * Delete a post
 */
export async function deletePost(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  slug: string
): Promise<boolean> {
  const response = await request.delete(`${baseURL}/api/posts/${slug}`, {
    headers: { Cookie: authCookie },
  });

  return response.ok();
}

/**
 * Delete media
 */
export async function deleteMedia(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  id: string | number
): Promise<boolean> {
  const response = await request.delete(`${baseURL}/api/media/${id}`, {
    headers: { Cookie: authCookie },
  });

  return response.ok();
}

/**
 * Cleanup multiple test posts
 */
export async function cleanupTestPosts(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  slugs: string[]
): Promise<void> {
  for (const slug of slugs) {
    try {
      await deletePost(request, baseURL, authCookie, slug);
    } catch (error) {
      // Ignore errors during cleanup
      console.warn(`Failed to cleanup post ${slug}:`, error);
    }
  }
}

/**
 * Cleanup multiple media files
 */
export async function cleanupTestMedia(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  ids: (string | number)[]
): Promise<void> {
  for (const id of ids) {
    try {
      await deleteMedia(request, baseURL, authCookie, id);
    } catch (error) {
      // Ignore errors during cleanup
      console.warn(`Failed to cleanup media ${id}:`, error);
    }
  }
}

/**
 * Create test image buffer
 */
export function createTestImage(type: 'transparent' | 'red' | 'gif' = 'transparent'): Buffer {
  switch (type) {
    case 'red':
      return testImages.redPNG;
    case 'gif':
      return testImages.simpleGIF;
    case 'transparent':
    default:
      return testImages.transparentPNG;
  }
}

/**
 * Create large test buffer (for testing file size limits)
 */
export function createLargeBuffer(sizeInMB: number): Buffer {
  return testImages.createLargeBuffer(sizeInMB);
}

/**
 * Wait for a specified duration
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate random string
 */
export function randomString(length: number = 10): string {
  return Math.random()
    .toString(36)
    .substr(2, length)
    .padEnd(length, '0');
}

/**
 * Generate unique slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse cookie header
 */
export function parseCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Extract cookie attributes
 */
export function getCookieAttributes(cookieHeader: string): {
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string | null;
  maxAge: number | null;
  expires: Date | null;
} {
  const parts = cookieHeader.split(';').map((p) => p.trim());
  const [nameValue] = parts;
  const value = nameValue.split('=')[1];

  const attributes = {
    value,
    httpOnly: parts.some((p) => p.toLowerCase() === 'httponly'),
    secure: parts.some((p) => p.toLowerCase() === 'secure'),
    sameSite: null as string | null,
    maxAge: null as number | null,
    expires: null as Date | null,
  };

  // Parse SameSite
  const sameSite = parts.find((p) => p.toLowerCase().startsWith('samesite='));
  if (sameSite) {
    attributes.sameSite = sameSite.split('=')[1];
  }

  // Parse Max-Age
  const maxAge = parts.find((p) => p.toLowerCase().startsWith('max-age='));
  if (maxAge) {
    attributes.maxAge = parseInt(maxAge.split('=')[1]);
  }

  // Parse Expires
  const expires = parts.find((p) => p.toLowerCase().startsWith('expires='));
  if (expires) {
    attributes.expires = new Date(expires.split('=')[1]);
  }

  return attributes;
}

/**
 * Validate response structure matches expected shape
 */
export function validateResponseStructure(
  response: any,
  expectedShape: Record<string, any>
): boolean {
  for (const [key, expectedType] of Object.entries(expectedShape)) {
    if (!(key in response)) {
      return false;
    }

    const value = response[key];
    const type = typeof value;

    if (expectedType === 'string' && type !== 'string') return false;
    if (expectedType === 'number' && type !== 'number') return false;
    if (expectedType === 'boolean' && type !== 'boolean') return false;
    if (expectedType === 'object' && (type !== 'object' || value === null)) return false;
    if (expectedType === 'array' && !Array.isArray(value)) return false;
  }

  return true;
}

/**
 * Retry async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        const delay = initialDelayMs * Math.pow(2, i);
        await wait(delay);
      }
    }
  }

  throw lastError!;
}

/**
 * Check if response is JSON
 */
export function isJsonResponse(response: any): boolean {
  const contentType = response.headers()['content-type'] || '';
  return contentType.includes('application/json');
}

/**
 * Extract error message from response
 */
export async function getErrorMessage(response: any): Promise<string> {
  if (isJsonResponse(response)) {
    try {
      const body = await response.json();
      return body.error || body.message || 'Unknown error';
    } catch {
      return await response.text();
    }
  }

  return await response.text();
}

/**
 * Create authenticated request context
 */
export async function createAuthenticatedContext(
  request: APIRequestContext,
  baseURL: string,
  email?: string,
  password?: string
): Promise<{ cookie: string; request: APIRequestContext }> {
  const cookie = await loginAndGetCookie(request, baseURL, email, password);

  return {
    cookie,
    request,
  };
}

/**
 * Batch create test posts
 */
export async function batchCreatePosts(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  count: number,
  template: Partial<{ title: string; content: string; excerpt: string; status: string }> = {}
): Promise<any[]> {
  const posts = [];

  for (let i = 0; i < count; i++) {
    const post = await createTestPost(request, baseURL, authCookie, {
      title: template.title || `Test Post ${Date.now()}-${i}`,
      content: template.content || `Test content for post ${i}`,
      excerpt: template.excerpt || `Test excerpt ${i}`,
      status: (template.status as any) || 'DRAFT',
    });

    posts.push(post);

    // Small delay to avoid rate limiting
    await wait(100);
  }

  return posts;
}

/**
 * Batch upload test media
 */
export async function batchUploadMedia(
  request: APIRequestContext,
  baseURL: string,
  authCookie: string,
  count: number
): Promise<any[]> {
  const media = [];

  for (let i = 0; i < count; i++) {
    const item = await uploadTestMedia(request, baseURL, authCookie, {
      fileName: `batch-upload-${Date.now()}-${i}.png`,
    });

    media.push(item);

    // Small delay to avoid rate limiting
    await wait(100);
  }

  return media;
}

/**
 * Verify pagination metadata
 */
export function verifyPaginationMetadata(
  pagination: any,
  expectedPage: number,
  expectedLimit: number
): boolean {
  return (
    pagination.page === expectedPage &&
    pagination.limit === expectedLimit &&
    typeof pagination.total === 'number' &&
    typeof pagination.totalPages === 'number' &&
    pagination.totalPages >= 0 &&
    pagination.total >= 0
  );
}

/**
 * Generate realistic test post content
 */
export function generatePostContent(
  paragraphs: number = 3,
  wordsPerParagraph: number = 50
): string {
  const words = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
  ];

  let content = '# Test Post\n\n';

  for (let i = 0; i < paragraphs; i++) {
    const paragraph = [];

    for (let j = 0; j < wordsPerParagraph; j++) {
      paragraph.push(words[Math.floor(Math.random() * words.length)]);
    }

    content += paragraph.join(' ') + '.\n\n';
  }

  return content;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error.message?.includes('ECONNREFUSED') ||
    error.message?.includes('ETIMEDOUT') ||
    error.message?.includes('ENOTFOUND')
  );
}

/**
 * Assert response has required fields
 */
export function assertHasFields(obj: any, fields: string[]): void {
  for (const field of fields) {
    if (!(field in obj)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}
